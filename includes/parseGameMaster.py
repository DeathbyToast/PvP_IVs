from google.cloud import storage
import jmespath
import json
import re

def parseGM(data, context):
    """Triggered by a change to a Cloud Storage bucket.
    Args:
         event (dict): Event payload.
         context (google.cloud.functions.Context): Metadata for the event.
    
    #Background Cloud Function to be triggered by Cloud Storage.
    #This generic function logs relevant data when a file is changed.

    Args:
        data (dict): The Cloud Functions event payload.
        context (google.cloud.functions.Context): Metadata of triggering event.
    Returns:
        None; the output is written to Stackdriver Logging
        
    print('parseGM: Event ID: {}'.format(context.event_id))
    print('parseGM: Event type: {}'.format(context.event_type))
    print('parseGM: Bucket: {}'.format(data['bucket']))
    print('parseGM: File: {}'.format(data['name']))
    print('parseGM: Metageneration: {}'.format(data['metageneration']))
    print('parseGM: Created: {}'.format(data['timeCreated']))
    print('parseGM: Updated: {}'.format(data['updated']))
    """
    print(f"29-parseGM: Detected file {data['name']} has been {context.event_type} in bucket {data['bucket']}")
    
    if data['name'] == "GAME_MASTER.json":
        json = download_json(data['bucket'], data['name'])
        print(f"33-parseGM: json successfully downloaded for {data['name']}, content: {json}.")
        #parsed = JMESPath(json['itemTemplates'])
        parsed = JMESPath(json)
        #print(f"36-parseGM: JMESPath filtering successful for {data['name']}")
        parsed = correctForms(parsed)
        upload_json(data['bucket'], "GAME_MASTER_partial.json", parsed)
        print(f"38-parseGM: Successfully processed {data['name']}")
        return True
    elif data['name'] == "GAME_MASTER_partial.json":
        json = download_json(data['bucket'], data['name'])
        print(f"42-parseGM: json successfully downloaded for {data['name']}, content: {json}.")
        monObj = buildMonObject(json)
        monObj = polishMonObject(monObj)
        outputMon = convertMonObj(monObj)
        upload_json(data['bucket'], "GAME_MASTER_parsed.json", outputMon)
        print(f"47-parseGM: Successfully processed {data['name']}")
        return True
    elif data['name'] == "GAME_MASTER_parsed.json":
        print(f"50-parseGM: Skipping processing our own output: file={data['name']}")
        return True
    else:
        print(f"53-parseGM: Unknown file detected: {data['name']}")
        return False

def convertMonObj(monObj):
    output = ""
    comma = ""
    first = True
    
    print(f"convertMonObj: Attempting to convert monObj to string")
    for mon in monObj.keys():
        outStr = comma + "{'label': '"
        outStr += str(mon.title())
        outStr += "', 'value': '"
        outStr += str(monObj[mon])
        outStr += "'}"
        output += outStr
        if first:
            first = False
            comma = ","

    print(f"convertMonObj: Successfully converted monObj to string")
    return output

def getRelatedMon(buffer, monObj, mon, dex):
    # this function takes in a mon's parent/evolution nums/names and
    # returns the mon's parent's parent/evolution nums and the
    # mon's evolution's parent/evolution nums back to polishMonObject
    
    output = ""
    first = True
    if "MEOWTH" in mon: print(f"gRM: {mon}: Starting with buffer:'{buffer}', mon:'{mon}', dex:'{dex}'")#, and monObj:'{monObj}'")
    for i in range(len(buffer)):
        # TODO: dead code that should be removed??
        if buffer[i] == "::p::" or buffer[i] == "::e::":
            continue
        else:
            # add this to mon's output
            if buffer[i] == "PORYGON2":
                out = ((monObj[buffer[i]]).split(","))[0]
                print(f"gRM: {mon}: PORYGON2 Fix: Converting to dex number ({out})")
            elif any(char.isdigit() for char in buffer[i]):
                out = buffer[i]
                print(f"gRM: {mon}: DID NOT NEED TO CONVERT '{buffer[i]}' to dex number!!!")
            else:
                if "MEOWTH" in mon: print(f"gRM: {mon}: Need to convert '{buffer[i]}' to dex number...")
                out = ((monObj[buffer[i]]).split(","))[0]
                if "MEOWTH" in mon: print(f"gRM: {mon}: Converted to '{out}'")
            if first:
                first = False
                output += out
            else: output += "," + out
            if "MEOWTH" in mon: print(f"gRM: {mon}: Added {out} to output, now: {output} (dex={dex})")
            
            # now process this entry's parents/evos and add to output
            if len(monObj[buffer[i]].split(",",4)) < 5:
                print(f"About to crash: mon: monObj[{mon}]: '{monObj[mon]}' monObj[{buffer[i]}]: '{monObj[buffer[i]]}'")
            else:
                nextBuffer = (monObj[buffer[i]].split(",",4))[4]
                if "MEOWTH" in mon: print(f"gRM: {mon}: Starting nextBuffer processing loop with {nextBuffer}...")
                nextBuffer = nextBuffer.split(",")
                for num in nextBuffer:
                    if "MEOWTH" in mon: print(f"gRM: {mon}: Processing '{num}' in {nextBuffer}")
                    if num == "::p::" or num == "::e::":
                        if mon == "BURMY": print(f"gRM: {mon}: Skipping '{num}' in {nextBuffer}")
                        continue
                    else:
                        if num == "PORYGON2":
                            num = ((monObj[num]).split(","))[0]
                            print(f"gRM: {mon}: PORYGON2 Fix: Converting to dex number ({num})")
                        elif any(char.isdigit() for char in num):
                            True
                        else:
                            if "MEOWTH" in mon: print(f"gRM: {mon}: Need to convert '{num}' to dex number...")
                            num = ((monObj[num]).split(","))[0]
                            if "MEOWTH" in mon: print(f"gRM: {mon}: Converted to '{num}'")
                        if num != dex:
                            if first:
                                first = False
                                output += num
                            else: output += "," + num
                            if "MEOWTH" in mon: print(f"gRM: {mon}: Added {num} to output, now: {output} (dex={dex})")
                        else:
                            if "MEOWTH" in mon: print(f"gRM: {mon}: Skipping addding {num} to output, as it equals dex={dex}")
                            continue
    
    if "MEOWTH" in mon: print(f"gRM: {mon}: Returning {output}")
    return output

def polishMonObject(monObj):
    
    for mon in monObj:
        # ensure there are parents/evos for us to process
        if monObj[mon].count(",") == 3:
            if "MEOWTH" in mon: print(f"pMO: {mon} has no parent or evos, skipping")
            continue
        
        if "MEOWTH" in mon: print(f"pMO: {mon} Starting with: '{monObj[mon]}'")
        # 0:Dex | 1:aStat | 2:dStat | 3:sStat | 4: ???
        firstBuffer = (monObj[mon]).split(",",4)
        dex = (monObj[mon]).split(",")[0]
        toProcess = (firstBuffer[4]).split(",")
        if "MEOWTH" in mon: print(f"pMO: {mon} Split into firstBuffer:'{firstBuffer}' and toProcess:'{toProcess}'")

        # pass off to processing function, returns final string (with dupes)
        secondBuffer = getRelatedMon(toProcess, monObj, mon, dex)
        if "MEOWTH" in mon: print(f"pMO: {mon} Sent toProcess:'{toProcess}' to getRelatedMon(), received secondBuffer:'{secondBuffer}'")
        
        # removes duplicates and orders list if more than one element
        secondBuffer = list(set(secondBuffer.split(",")))
        
        if len(secondBuffer) > 1:
            try:
                secondBuffer.sort(key=int)
            except ValueError:
                secondBuffer.sort(key=natural_keys)
        
        # combine original firstBuffer with new output in secondBuffer
        del firstBuffer[-1] # remove what was passed to getRelatedMon()
        if "MEOWTH" in mon: print(f"pMO: {mon} Combining firstBuffer:'{firstBuffer}' and secondBuffer:'{secondBuffer}'")
        monObj[mon] = firstBuffer + list(secondBuffer)
        monObj[mon] = ",".join(monObj[mon]) #convert list back to string
        if "MEOWTH" in mon: print(f"pMO: {mon} Combined firstBuffer and secondBuffer to :'{monObj[mon]}'")

    return monObj
'''
Two functions below for sorting char+int strings
https://stackoverflow.com/questions/5967500/how-to-correctly-sort-a-string-with-a-number-inside
'''
def atoi(text):
    return int(text) if text.isdigit() else text

def natural_keys(text):
    '''
    alist.sort(key=natural_keys) sorts in human order
    http://nedbatchelder.com/blog/200712/human_sorting.html
    (See Toothy's implementation in the comments)
    '''
    return [ atoi(c) for c in re.split(r'(\d+)', text) ]

def buildMonObject(json):
    #pokemonId: pokemonSettings.pokemonId
    #form: pokemonSettings.form
    #evolutionIds: pokemonSettings.evolutionBranch[*].evolution
    #evolutionForms: pokemonSettings.evolutionBranch[*].form
    #familyId: pokemonSettings.familyId
    #parentPokemonId: pokemonSettings.parentPokemonId
    #baseAttack: pokemonSettings.stats.baseAttack
    #baseDefense: pokemonSettings.stats.baseDefense
    #baseStamina: pokemonSettings.stats.baseStamina
    #templateId: templateId // V0351_POKEMON_CASTFORM_SUNNY
    #dexNum: 351
    #name: CASTFORM_SUNNY
    
    #https://stackoverflow.com/questions/56929931/how-to-run-a-nested-loop-inside-list-such-that-the-outer-loop-starts-from-the-ne
    #for index,sub_list1 in enumerate(yx):
    #for sub_list2 in yx[index+1:]:
    #    print(sub_list2)
    
    monObj = {}
    
    for mon in json:
        # Remove Orphan evos and parents
        orphans = ["RAICHU_ALOLA", "EXEGGUTOR_ALOLA", "MAROWAK_ALOLA", "SHEDINJA", "WEEZING_GALARIAN"]
        if mon['name'] in orphans:
            mon['parentPokemonId'] = None
            mon['evolutionIds'] = None
            print(f"ORPHAN FIX: buildMonObject: cleared {mon['name']}'s evos '{mon['evolutionIds']}' and parent '{mon['parentPokemonId']}' info")
        
        # Fix MANTINE's missing parent (MANTYKE)
        if mon['name'] == "MANTINE" and mon['parentPokemonId'] is None:
            mon['parentPokemonId'] = "MANTYKE"
            print(f"MANTINE FIX: buildMonObject: {mon['name']}'s parentPokemonId is now:'{mon['parentPokemonId']}'")

        # Fix DEERLING's missing evolution (SAWSBUCK)
        if mon['name'] == "DEERLING" and mon['evolutionIds'] is None:
            mon['evolutionIds'] = []
            mon['evolutionIds'].append("SAWSBUCK")
            print(f"DEERLING FIX: buildMonObject: {mon['name']}'s evolutionIds is now:'{mon['evolutionIds']}'")
        
        # Fix FARFETCHD_GALARIAN's missing evolution (SIRFETCHD)
        if mon['name'] == "FARFETCHD_GALARIAN" and mon['evolutionIds'] is None:
            mon['evolutionIds'] = []
            mon['evolutionIds'].append("SIRFETCHD")
            print(f"FARFETCHD_GALARIAN FIX: buildMonObject: {mon['name']}'s evolutionIds is now:'{mon['evolutionIds']}'")

        # Fix GASTRODON's missing parent (SHELLOS)
        if mon['name'] == "GASTRODON" and mon['parentPokemonId'] is None:
            mon['parentPokemonId'] = "SHELLOS"
            print(f"GASTRODON FIX: buildMonObject: {mon['name']}'s parentPokemonId is now:'{mon['parentPokemonId']}'")
        
        # Remove MANAPHY's parent (PHIONE)
        if mon['name'] == "MANAPHY" and mon['parentPokemonId'] is not None:
            mon['parentPokemonId'] = None
            print(f"PHIONE FIX: buildMonObject: {mon['name']}'s parentPokemonId is now:'{mon['parentPokemonId']}'")

        monObj[mon['name']] = str(mon['dexNum']) + "," + str(mon['baseAttack']) + "," + str(mon['baseDefense']) + "," + str(mon['baseStamina'])
        if "MEOWTH" in mon: print(f"buildMonObject: Checking {mon['name']}'s parentPokemonId:'{mon['parentPokemonId']}'")
        if mon['parentPokemonId'] is not None:
            #parent = mon['parentPokemonId']
            monObj[mon['name']] += "," + mon['parentPokemonId']
            #monObj[mon['name']] += "," + "::p::," + mon['parentPokemonId']

        if "MEOWTH" in mon: print(f"buildMonObject: Checking {mon['name']}'s evolutionIds:'{mon['evolutionIds']}' and evolutionForms:'{mon['evolutionForms']}'")
        buffer = findEvos(mon['name'], mon['evolutionIds'], mon['evolutionForms'])
        if buffer:
            monObj[mon['name']] += buffer
            #monObj[mon['name']] += ",::e::" +buffer[1]
            if "MEOWTH" in mon: print(f"buildMonObject: Added {mon['name']}'s evolutions:'{buffer[1]}'")
   
    return monObj

def findEvos(name, eIds, eFrms):
    evos = ""
    
    # check for length mismatches (BURMY fix)
    if eFrms is not None and len(eFrms) != len(eIds):
        if len(eIds) > len(eFrms):
            if "MEOWTH" in name: print(f"264-findEvos: {name} has more eIds:'{eIds}' than eFrms:'{eFrms}'!")
            for eId in eIds:
                if not eFrms:
                    if "MEOWTH" in name: print(f"267-findEvos: {name} No more eFrms({eFrms}), adding eId:'{eId}' to evos")
                    evos += "," + eId
                    eIds.remove(eId)
                    if "MEOWTH" in name: print(f"270-findEvos: {name} Removed eId:'{eId}' from  eIds:'{eIds}'")
                else:
                    for eFrm in eFrms:
                        if eId in eFrm:
                            if "MEOWTH" in name: print(f"272-findEvos: {name} eId:'{eId}' found in eFrm:'{eFrm}', adding to evos")
                            evos += "," + eFrm
                            if eFrm == 'WORMADAM_PLANT':
                                if "MEOWTH" in name: print(f"275-findEvos: {name}: Sandy+Trash evo forms being manually added")
                                evos += "," + 'WORMADAM_SANDY' + "," + 'WORMADAM_TRASH'
                                if "MEOWTH" in name: print(f"277-findEvos: {name}: evos now: '{evos}'")
                            else:
                                if "MEOWTH" in name: print(f"278-findEvos: '{eFrm}' != 'WORMADAM_PLANT'")
                            eFrms.remove(eFrm)
                            eIds.remove(eId)
                            if "MEOWTH" in name: print(f"279-findEvos: {name} Removed eId:'{eId}' and eFrm:'{eFrm}' from  eIds:'{eIds}' and eFrms:'{eFrms}'")
                        else:
                            if "MEOWTH" in name: print(f"281-findEvos: {name} eId:'{eId}' not found in eFrm:'{eFrm}'!")

            # after merging eFrms and eIds
            if not eFrms:
                if not eIds:
                    if "MEOWTH" in name: print(f"289-findEvos: {name} Moved all eFrms:'{eFrms}' and eIds:'{eIds}' to evos, returning")
                    return evos
                if "MEOWTH" in name: print(f"291-findEvos: {name} Moved all eFrms:'{eFrms}' to evos, need to add remaining eIds:'{eIds}'...")
                for eId in eIds:
                    evos += "," + eId
                    eIds.remove(eId)
                if "MEOWTH" in name: print(f"295-findEvos: {name} Moved all eFrms:'{eFrms}' and eIds:'{eIds}' to evos({evos}), returning")
                return evos
            else:
                if "MEOWTH" in name: print(f"298-findEvos: {name} Unable to move all eFrms:'{eFrms}' to evos! eIds:'{eIds}'...")
                raise Exception(f"findEvos: {name} Unable to move all eFrms:'{eFrms}' to evos! eIds:'{eIds}'...")
                return False
        else:
            if "MEOWTH" in name: print(f"302-findEvos: {name} has unequal number of eIds:'{eIds}' and eFrms:'{eFrms}'!")
            raise Exception(f"findEvos: {name} has unequal number of eIds:'{eIds}' and eFrms:'{eFrms}'!")
            return False
        
    # determine if we should use evolutionIds or evolutionForms
    if eIds is not None:
        if checkNone_Normal(eFrms):
            #print(f"309-findEvos: checkNone_Normal:True for {name} detected eFrms({eFrms}) is either None or contains '_NORMAL'")
            for evo in eIds:
                evos += "," + evo#str(monObj[evo].partition(',')[0])
                #print(f"312-findEvos: Added {evo}'s dexNum {monObj[evo].partition(',')[0]}, will need to check evolution's evolutions")
                if "MEOWTH" in name: print(f"314-findEvos: Added {evo}'s dexNum, will need to check evolution's evolutions")
            return evos
        else:
            #print(f"315-findEvos: checkNone_Normal:False for {name} detected mon['evolutionForms']({eFrms}) is valid and doesn't contain '_NORMAL'")
            for evo in eFrms:
                evos += "," + evo#str(monObj[evo].partition(',')[0])
                #print(f"318-findEvos: need to check evolution's evolutions")
                #print(f"319-findEvos: Added {evo}'s dexNum {monObj[evo].partition(',')[0]}, will need to check evolution's evolutions")
                if "MEOWTH" in name: print(f"322-findEvos: Added {evo}'s dexNum, will need to check evolution's evolutions")
            return evos

    # return False if there are no Evos for this mon (ex: Venusaur)
    return False

def checkNone_Normal(evoForms):
    if evoForms is None:
        #print(f"327-Received {evoForms}, returning True")
        return True
    else:
        for form in evoForms:
            if "_NORMAL" in form:
                #print(f"332-Received {evoForms}, returning True")
                return True
            elif "CHERRIM_" in form:
                #print(f"335-Received {evoForms}, returning True")
                return True
            elif "GASTRODON_" in form:
                #print(f"338-Received {evoForms}, returning True")
                return True
            else:
                #print(f"341-Received {evoForms}, returning False")
                return False

def correctForms(json):
    #pokemonId: pokemonSettings.pokemonId
    #form: pokemonSettings.form
    #evolutionIds: pokemonSettings.evolutionBranch[*].evolution
    #evolutionForms: pokemonSettings.evolutionBranch[*].form
    #familyId: pokemonSettings.familyId
    #parentPokemonId: pokemonSettings.parentPokemonId
    #baseAttack: pokemonSettings.stats.baseAttack
    #baseDefense: pokemonSettings.stats.baseDefense
    #baseStamina: pokemonSettings.stats.baseStamina
    #templateId: templateId // V0351_POKEMON_CASTFORM_SUNNY
    
    for mon in json:
        # parse dexNum and add "&eggsonly"
        mon['dexNum'], mon['name'] = parseDexNumName(mon['templateId'], mon['familyId'])
        if not mon['evolutionIds']: # check if it is []
            mon['evolutionIds'] = None # convert [] to None
        if not mon['evolutionForms']: # check if it is []
            mon['evolutionForms'] = None # convert [] to None

        if "MEOWTH" in mon['familyId']: print(f"375-correctForms: {mon['name']} Checking if parent({mon['parentPokemonId']}) needs Alola/Galarian fix...")
        # fix Alolan parent names
        alolans = ["FAMILY_PIKACHU", "FAMILY_RATTATA", "FAMILY_SANDSHREW", "FAMILY_VULPIX", "FAMILY_DIGLETT", "FAMILY_MEOWTH", "FAMILY_GEODUDE", "FAMILY_GRIMER", "FAMILY_EXEGGCUTE", "FAMILY_CUBONE"]
        orphans = ["RAICHU_ALOLA", "EXEGGUTOR_ALOLA", "MAROWAK_ALOLA"]
        if mon['familyId'] in alolans and "_ALOLA" in mon['name'] and mon['parentPokemonId']:
            if mon['name'] in orphans:
                if "MEOWTH" in mon['familyId']: print(f"381-correctForms: Skipping Alolan correction for {mon['name']}'s parent {mon['parentPokemonId']}, won't include '_ALOLA'")
                continue
            else:
                mon['parentPokemonId'] += "_ALOLA"
                if "MEOWTH" in mon['familyId']: print(f"385-correctForms: {mon['name']}'s parent {mon['parentPokemonId']} now includes '_ALOLA'")
                
        # fix Galarian parent names
        galarians = ["FAMILY_KOFFING", "FAMILY_ZIGZAGOON", "FAMILY_MEOWTH", "FAMILY_FARFETCHD", "FAMILY_DARUMAKA"]
        orphans = ["WEEZING_GALARIAN", "FAMILY_STUNFISK"]
        if mon['familyId'] in galarians and "_GALARIAN" in mon['name'] and mon['parentPokemonId'] or int(mon['dexNum'].split("&")[0]) > 809: # include Galar dex mon
            if mon['name'] in orphans:
                if "MEOWTH" in mon['familyId']: print(f"392-correctForms: Skipping Galarian correction for {mon['name']}'s parent {mon['parentPokemonId']}, won't include '_GALARIAN'")
                continue
            else:
                mon['parentPokemonId'] += "_GALARIAN"
                if "MEOWTH" in mon['familyId']: print(f"396-correctForms: {mon['name']}'s parent {mon['parentPokemonId']} now includes '_GALARIAN'")
        
        if "MEOWTH" in mon['familyId']: print(f"398-correctForms: {mon['name']} final parent is {mon['parentPokemonId']}")

    return json

def parseDexNumName(templateId, familyId):
    # parse out the dexNum and name from templateId
    dexNum, name = templateId.split('_POKEMON_')
    dexNum = re.sub('V0+', '', dexNum);
    #print(f"395-parseDexNum: split out V00xx and _POKEMON_, left with: {dexNum} and {name}")
    
    if familyId == "FAMILY_NIDORAN_FEMALE":
        if name == "NIDORAN":
            return dexNum, "NIDORAN_FEMALE"
    if familyId == "FAMILY_NIDORAN_MALE":
        if name == "NIDORAN":
            return dexNum, "NIDORAN_MALE"

    # add "&eggsonly" to dexNum as appropriate
    babies = [172, 173, 174, 175, 236, 238, 239, 240, 298, 360, 406, 433, 438, 439, 440, 446, 447, 458]
    if int(dexNum) in babies:
        dexNum = dexNum+"&eggsonly"
        #print (f"406-parseDexNum: found baby at {dexNum}")
    # add typing to Wormadam dexNum as appropriate
    elif int(dexNum) == 413:
        if name == "WORMADAM_TRASH":
            dexNum = dexNum+"&Steel"
        elif name == "WORMADAM_SANDY":
            dexNum = dexNum+"&Ground"
        elif name == "WORMADAM_PLANT":
            dexNum = dexNum+"&Grass"
        #print (f"417-parseDexNum: added typing to Wormadam form: '{name}', now: '{dexNum}'")

    # add &alola or &!alola to the dexNum as appropriate
    alolans = ["FAMILY_PIKACHU", "FAMILY_RATTATA", "FAMILY_SANDSHREW", "FAMILY_VULPIX", "FAMILY_DIGLETT", "FAMILY_MEOWTH", "FAMILY_GEODUDE", "FAMILY_GRIMER", "FAMILY_EXEGGCUTE", "FAMILY_CUBONE"]
    orphans = ["PIKACHU", "PICHU", "EXEGGCUTE", "CUBONE"]
    if familyId in alolans and int(dexNum.split("&")[0]) < 810: #skip perrseker and obstagoon
        if "ALOLA" in name:
            dexNum = dexNum + "&alola"
            #if familyId == "FAMILY_MEOWTH": print(f"431-parseDexNum: Added &alola to {name} as it contains ALOLA")
        elif name in orphans:
            if familyId == "FAMILY_MEOWTH": print(f"433-parseDexNum: Skipping adding &!alola to {name} as Alolan doesn't exist")
        else:
            dexNum = dexNum + "&!alola"
            #if familyId == "FAMILY_MEOWTH": print(f"436-parseDexNum: Adding &!alola to {name} as it isn't an alolan")
        #if familyId == "FAMILY_MEOWTH": print(f"437-parseDexNum: finsihed processing alolan family, now: {dexNum} and {name}")

    # add &galar or &!galar to the dexNum as appropriate
    galarians = ["FAMILY_KOFFING", "FAMILY_ZIGZAGOON", "FAMILY_MEOWTH", "FAMILY_FARFETCHD", "FAMILY_DARUMAKA", "FAMILY_STUNFISK"]
    orphans = ["WEEZING_GALARIAN", "STUNFISK_GALARIAN", "PERSIAN", "PERSIAN_ALOLA"]
    if familyId in galarians and int(dexNum.split("&")[0]) < 810: #skip perrseker and obstagoon
        if "GALARIAN" in name:
            dexNum = dexNum + "&galar"
            #if familyId == "FAMILY_MEOWTH": print(f"445-parseDexNum: Added &galar to {name} as it contains GALARIAN")
        elif name in orphans:
            if familyId == "FAMILY_MEOWTH": print(f"447-parseDexNum: Skipping adding &!galar to {name} as Galarian doesn't exist")
        else:
            dexNum = dexNum + "&!galar"
            #if familyId == "FAMILY_MEOWTH": print(f"450-parseDexNum: Adding &!galar to {name} as it isn't a Galarian")
        #if familyId == "FAMILY_MEOWTH": print(f"451-parseDexNum: finsihed processing galarian family, now: {dexNum} and {name}")

    # fix Darmanitan Zen and Standard forms
    if "DARMANITAN" in name:
        if "ZEN" in name:
            if "GALARIAN" in name:
                dexNum = dexNum + "&fire"
            else:
                dexNum = dexNum + "&psychic"
        elif "STANDARD" in name:
            if "GALARIAN" in name:
                dexNum = dexNum + "&!fire"
            else:
                dexNum = dexNum + "&!psychic"

    #if familyId == "FAMILY_MEOWTH": print(f"443-parseDexNum: returning {dexNum} and {name}")
    return dexNum, name

def JMESPath(json):
    #print(f"453-JMESPath: Attempting to parse {json}")
    jmespathQuery = '[? templateId >= `"V"`] | [? templateId < `"W"`] | '+"[?contains (templateId,'POKEMON')] | [?!contains (templateId,'_NORMAL')]"
    jmespathQuery += "| [?templateId != 'V0487_POKEMON_GIRATINA'] | [?templateId != 'V0492_POKEMON_SHAYMIN'] | [?templateId != 'V0413_POKEMON_WORMADAM'] | [?templateId != 'V0555_POKEMON_DARMANITAN']"
    jmespathQuery += "| [?!contains (templateId,'V0649_POKEMON_GENESECT_')] | [?!contains (templateId,'V0586_POKEMON_SAWSBUCK_')] | [?!contains (templateId,'V0585_POKEMON_DEERLING_')]"
    jmespathQuery += "| [?!contains (templateId,'V0550_POKEMON_BASCULIN_')] | [?!contains (templateId,'V0493_POKEMON_ARCEUS_')] | [?!contains (templateId,'V0422_POKEMON_SHELLOS_')]"
    jmespathQuery += "| [?!contains (templateId,'V0351_POKEMON_CASTFORM_')] | [?!contains (templateId,'V0421_POKEMON_CHERRIM_')] | [?!contains (templateId,'V0412_POKEMON_BURMY_')]"
    jmespathQuery += "| [?!contains (templateId,'POKEMON_SAWSBUCK_')] | [?!contains (templateId,'V0423_POKEMON_GASTRODON_')] | [?!contains (templateId,'V0647_POKEMON_KELDEO_')]"
    jmespathQuery += "| [?!contains (templateId,'V0593_POKEMON_JELLICENT_FEMALE')] | [?!contains (templateId,'V0592_POKEMON_FRILLISH_FEMALE')]"
    jmespathQuery += "| [?!contains (templateId,'_SHADOW')] | [?!contains (templateId,'_PURIFIED')] | [?!contains (templateId,'_FALL_2019')] | [?!contains (templateId,'_COSTUME_2020')]"
    jmespathQuery += "| [?!contains (templateId,'FORMS_')] | [?!contains (templateId,'_COPY_2019')] | [?!contains (templateId,'VS_')]"
    jmespathQuery += "| [*].{pokemonId: data.pokemonSettings.pokemonId,  form: data.pokemonSettings.form, evolutionIds: data.pokemonSettings.evolutionBranch[*].evolution, evolutionForms: data.pokemonSettings.evolutionBranch[*].form, familyId: data.pokemonSettings.familyId, parentPokemonId: data.pokemonSettings.parentPokemonId, baseAttack: data.pokemonSettings.stats.baseAttack, baseDefense: data.pokemonSettings.stats.baseDefense, baseStamina: data.pokemonSettings.stats.baseStamina, type: data.pokemonSettings.type, type2: data.pokemonSettings.type2, templateId: templateId}";
    result = jmespath.search(jmespathQuery, json)
    #print(f"464-JMESPath: Successfully executed query, result: {result}")
    return result

def upload_json(bucket_name, output_blob_name, toUpload):
    #Uploads json to the bucket
    print(f"460-DL_json: Attempting to upload blob {output_blob_name} .")
    storage_client = storage.Client()
    bucket = storage_client.get_bucket(bucket_name)
    blob = bucket.blob(output_blob_name)
    
    blob.upload_from_string(
    	json.dumps(toUpload),
    	content_type='application/json')
    
    blob.make_public()

    print(f"471-upload_json:successfully uploaded json")
    return True
    
def download_json(bucket_name, source_blob_name):
    #Downloads a blob from the bucket, converts to json
    #print(f"476-DL_json: Attempting to download blob {source_blob_name} .")
    storage_client = storage.Client()
    bucket = storage_client.get_bucket(bucket_name)
    blob = bucket.blob(source_blob_name)
    
    json_data_string = blob.download_as_string()
    json_data = json.loads(json_data_string)

    #print(f"484-DL_json: Blob {source_blob_name} successfully downloaded and loaded as json.")
    return json_data