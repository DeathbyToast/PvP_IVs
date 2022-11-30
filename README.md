# PvP_IVs
Description of features and functionality for the Pokémon Go PvP IVs website: https://pvpivs.com. If you have any questions, feel free to comment / open issues here on GitHub or reach out on [our Discord](https://discord.gg/UD4Temq) (tag @DeathByToast#0529)

## [PvP IVs Rankings (Single Pokémon)](https://pvpivs.com/)
#### Generating Top IVs for any Pokémon:
  1. Enter a Pokémon in the box at the top, which will autocomplete after two characters are entered
  2. Touch, click, or use arrow keys / enter to select the desired Pokémon which will load your results.
  3. To customize your results, you can select a different league or adjust the number of Top IVs shown using the boxes at the top of the page to the left of where you selected your Pokémon. *Your results can be shared using the auto-generated URL in your browser's address bar!*

#### Checking Specific PvP IVs Ranks:
  1. Just below where you select Pokémon, you can enter your specific IVs (Atk: attack, Def: defense, Sta: stamina) to see your Pokémon's PvP IVs. The table will auto-update when it has three valid IVs selected.
    * *You can also click on `Show IV input textbox` to bulk input IVs, but this option disappears as soon as a Pokémon is selected. Bulk IVs can also be input via the URL parameter `&IVs=`*
  2. To the left of the IV boxes is a shadow checkbox which adds the atk/def buffs/debuffs to this IV set. As this is a flat 20% atk buff and 20% def debuff, it does not re-order rankings or impact CMP.
  3. You can also use the green `+` button to add another row and compare multiple IVs at the same time.
  4. To remove any IVs, select the red `-` next to the row containing the IVs you'd like to remove from the comparison.

#### Rank Table Columns:
  * `#`: Rank number
  * `Lvl`: final level that is still under the League CP maximum
  * `CP`: final CP that is reached
  * `L<Min Level> CP`: If user selects `Show Min Level CP (Raid/Hatch)`, displays CP at `Min Level`
  * `Atk IV`/`Def`/`Stam`: The Attack/Defense/Stamina PvP IVs that this row corresponds to
  * `Perfect`: Relative PvP perfection percentage compared to the Rank 1 PvP IVs
  * `Dust`: If `Show Stardust Power-Up Costs` is selected, shows the amount of stardust needed to power up from `Min Level` to `Lvl`
  * If `Include CMP Tie Breaking` is selected, adds the following two columns:
    * `R1 CMP`: `W` (win) / `T` (tie) / `L` (loss) shows whether this specific set of PvP IVs will win a CMP tie against the Rank 1 (R1) Pokémon for this PvP League
    * `T100 CMP`: Counts the number of CMP wins vs the Top 100 PvP IVs for this Pokémon and this PvP League. Does not compare against all possible (up to 4096) possible PvP IVs to optimize performance *(this checkbox adds 100* * *100 comparisons on-top of the initial 4096 + sort)*
    
* `PvP Atk`/`Def`/`HP`: "Battle Stats" which are the computed Attack/Defense/HP stats used in the actual battles, comprising of the Pokémon's base stat + IV + CPM[Level]
* `Stat Prod`: Stat Product is the mathematical product of [PvP Atk * PvP Def * PvP HP ](https://github.com/DeathbyToast/PvP_IVs/blob/not-minified/includes/calculate.js#L43)

##### Atk/Def/HP ranges:
* Display the (minimum - maximum) possible stats for this specific Pokémon in this PvP League, and are also clickable as links which will lead to the highest Stat Product PvP IVs that still reach that min/max battle stat (IVs + base stats at CPM[Lvl])
* Generate <Pokémon> Search String to Trash below Rank ZZZ: where ZZZ is the calculated rank for these PvP IVs for this PvP League. These link(s) redirect to the Search String generator with the respective fields filled in. Very helpful for on-the-go inventory management on Community Days!

#### Advanced Settings:
 * *The drop down arrow to the right of the word "Advanced" toggles hiding/unhiding the Advanced Settings*
 * `IV Floor`: Adjusts the minimum possible PvP IVs to calculate the results for. Useful for comparing traded, weather-boosted, or non-tradeable (raid-only) PvP IVs
 * `Min Level`: Adjusts minimum level for calculations, often used with non-tradeable (mythical) or raid-exclusive PvP IVs
 * `Max Level`: Adjusts maximum level for calculations to check for XL (Level 41-50) or Best-Buddy (Level 41 or 51) impacts on PvP IVs
 * `PvP Stat Decimal Places`: Controls how many decimal places are displayed for PvP Attack and Defense
 * `Include CMP Tie Breaking`: Adds `R1 CMP` and `T100 CMP` columns to the PvP IVs rankings table as described above
 * `Export PvPoke Custom Group`: Outputs the user's IVs in a textbox which can be copied and pasted into PvPoke's Matrix Battle function to compare actual performance across multiple IVs to determine which is the best to invest in
* **Show Family Evolutions**: Computes the same (up to) 4096 rankings for the inputted IV combination(s) and displays the respective PvP ranks along with links to the respective results tables. Helpful for a quick-glance to see if that Bulbasaur is better as an Ivysaur or a Venusaur (without having to input the data twice!)
    * **NOTE:** This does currently show speculative Mega Evolution base stats, but until these are added to the Game Master file please treat these as subject to change! Niantic still has yet to [correct certain base stats](https://www.reddit.com/r/TheSilphArena/comments/amnynx/psa_be_careful_about_spending_resources_on_these/) in their game...
* **Family Evos League**: aaaa
* **Show Trade Improvement %**: aaaa
   * The table populates all eligible rows (limited by the IV Floor) sorted by friendship, as this is designed to help decide if it is worth saving specific Pokémon to trade at various friendship levels to get higher PvP IVs in the re-roll of the traded IVs.
   * As an example, a hatched 10/12/15 Medicham is rank 161. The highlighted row is green because the chance to roll higher PvP IVs is >60% ([orange/ok is >40%, red/bad is <40%](https://github.com/DeathbyToast/PvP_IVs/blob/master/index.html#L936)). The highlighted row is always the highest chance to improve PvP IVs / ranking as an indication of which level of friendship to target to optimize the chance of rolling better rank mon.
   * **This is one of my favorite ways to answer the question of: should I save these for trades?** Generally if it is <2% chance to improve, the answer is a no (unless it can't be wild-caught and is very meta-relevant like Cresselia or Registeel)

## [PvP IVs Rankings (League / All Pokémon)](https://pvpivs.com/leagueRanks.html)
#### Basics:

## [Search Strings](https://pvpivs.com/searchStr.html) generator
#### Basic usage to generate Search String for any Pokémon:
  1. Enter a "Final Mon" (Pokémon) in the box at the top, which will autocomplete after two characters are entered
  2. Either click to select (or touch on mobile), or use arrow keys / enter to select the desired Pokémon
* This will generate (by default) a Search String to find the Top 10 Great League <Pokémon>, but can be adjusted via the Settings outlined below
* To use this string, click inside the output text box (which will automatically copy the string to your device's clipboard) and then paste it into Pokémon Go to find your matches! You can also setup Text Replacement on your respective device [Silph.gg has great cross-platform instructions](https://silph.gg/pages/wpPage/how-to-use-pokemon-go-search-strings), but be warned that iOS limits these strings to 2000 characters...this is why there are multiple text boxes at the bottom of the page, they separate the output into 2000 character chunks if you'd like to piece together text replacement strings
#### Settings:
  * League: Allows for the results to be toggled between the three PvP Leagues: Great (<1501CP) / Ultra (<2501CP) / Master (any CP)
  * Trash String: inverts the results, outputting a string which instead of revealing the Top XX (default: 10) Final Mon, it would match potential Ranks 11-4096 Final Mon. **NOTE: As described in our [FAQ section](https://pvpivs.com/about.html), Search Strings are designed to ALWAYS match any possible CP/HPs which could be Ranks 1-XX (default:10). This means that there will be false positives (matches that are below Rank XX). Thus the Trash Strings will NEVER match Rank 1-10, and will sometimes fail to match actual Ranks 11-4096 (to avoid accidentally matching Rank 1-10 Final Mon).** *If this is still unclear, please let me know and I can clarify this explanation (this is a very common question each time I post Community Day Search Strings)*
  * Trash Perfect IVs: For Trash Strings **only**, this will add a &!4\* to explicitly exclude 100% IVs from the Trash String by default. By checking this box, it will allow the Trash String to Trash Perfect IVs (by removing the trailing &!4\*
  * Trash Zero IVs: Checked by default, this will have no impact until unchecked. By unchecking this box, Trash Strings will calculate CPs/HPs of possible 0% IV Final Mon, and exclude these from the Trash String results. The downside of this (and why it is checked by default) is that it will reduce the accuracy of the Trash String for 0\* appraisals. More possible matches means more false positives / worse Trash String results. However, I always check this box as I personally collect 0% IVs :D
  * Only Find 0% IVs: Checking this box will override any PvP specific Search Strings and only output CPs/HPs that are possible 0% IVs for the Final Mon
  * Use Base Evolution: Checked by default, this will allow input of Raichu but create a Search String that finds Pikachu that will be Rank 1-10 Raichu. If this box is unchecked then the Search String would find Pikachu that would be Rank 1-10 Pikachu isntead (as an example).
  * Use Baby Form: Allows Search Strings to find Pichu if checked instead of Pikachu that would be Rank 1-10 Raichu. Defaults to unchecked to cover the more common use case of filtering wild spawn Pikachus instead of hatched Pichus to become PvP Raichus (in this example).
  * Language: English by default, but changes CP/HP terms to the selected language equivalents instead

## [Type Chart](https://pvpivs.com/typeLookup.html) generator
* Supports both single and dual types
* Calculates accurate PoGo super effective / resistance damage multipliers
#### How to read the chart:
* **Top left**: Shows what damage type(s) are super effective at hurting the selected type(s)
  * *For bug types it reads: Fire deals x1.6 (160%) SE damage to Bug types*
* **Bottom left**: Shows what damage type(s) are not very effective at hurting the selected type(s)
  * *For bug types it reads: Fighting deals x0.625 (62.5%) NVE damage to Bug types*
* **Top right**: *single types only* Shows what type(s) the selected type is super effective at hurting
  * *For bug types it reads: Bug damage deals x1.6 (160%) SE damage to Dark types*
* **Bottom right**: *single types only* Shows what type(s) the selected type is not very effective at hurting
  * *For bug types it reads: Bug damage deals x0.625 (62.5%) NVE damage to Steel types*

## [Types Quiz](https://pvpivs.com/typeQuiz.html) 
* Supports quizzes for both single and dual types
* Tests single and double SE / NVE damage
* Auto-fills the correct number of types for each of the four quadrants (single types) or two quadrants for dual types
  * *However, there will always be at least one type possible to be filled in for each possible section, i.e. on normal types you have to select "None" and "None" for the top right quadrant to be correct (because Normal damage is Super Effective against zero/None types!)*

## [GitHub](https://github.com/DeathbyToast/PvP_IVs)!
* With the migration to PvPIVs.com I've open sourced all of my code via [this repo](https://github.com/DeathbyToast/PvP_IVs), so please feel free to add issues or pull requests, comments, etc as you see fit! *There are no guarantees on performance/stability/etc with this of course as this is just a fun hobby / side project for me!*
* Base Stats pulled *directly from Game Master file* via [Python Parser](https://github.com/DeathbyToast/PvP_IVs/blob/master/includes/parseGameMaster.py)
  * Ensures that there are no more stat typos or incorrect forms / evolutions!
  * Helps site stay current. As soon as forms are in the GM file, I can push the changes to the site!
