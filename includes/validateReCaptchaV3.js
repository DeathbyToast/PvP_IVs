const request = require('sync-request');
const util = require('util');
// Import the Secret Manager client and instantiate it:
const name = 'projects/47589622940/secrets/pvpivs-reCAPTCHA-v3-Secret-Key/versions/latest';
const {SecretManagerServiceClient} = require('@google-cloud/secret-manager');
const client = new SecretManagerServiceClient();

async function accessSecretVersion(startVerificationURL, endVerificationURL, res) {
  try {
    const [version] = await client.accessSecretVersion({name: name,});
    const payload = version.payload.data.toString();
    const verificationURL = startVerificationURL + payload + endVerificationURL;
    //console.info(`15: verificationURL: ${verificationURL}`);
    const reply = request('POST', verificationURL);
    body = JSON.parse(reply.body);
    console.log("16: Reply body:"+JSON.stringify(body));
    /* reCAPTCHA v3 response format
    {
    "success": true|false,      // whether this request was a valid reCAPTCHA token for your site
    "score": number             // the score for this request (0.0 - 1.0)
    "action": string            // the action name for this request (important to verify)
    "challenge_ts": timestamp,  // timestamp of the challenge load (ISO format yyyy-MM-dd'T'HH:mm:ssZZ)
    "hostname": string,         // the hostname of the site where the reCAPTCHA was solved
    "error-codes": [...]        // optional
    } */
    if (body.success !== undefined && body.success && (body.action === "validStart" || body.action === "searchStr")) {
      //Verified reCAPTCHA v3 success response!
      console.log("28:" + body.action+": Returning 'Success' (score:"+body.score+")");
      return res.status(200).send('Success');
    } else {
      // "success": false || invalid body.action
      console.error("32: invalid? success:"+body.success+", action:"+body.action+", score:"+body.score);
      console.error("33: 'Error code':"+body['error-codes']);
      return res.status(418).send('Error');
    }
  } catch (error) {
    console.error(error);
    // POST request failed..?
    return res.status(503).send('HTTP Request Failed, please try again later.');
  }
};

exports.validateReCaptchaV3 = (req, res) => {
  try {
    res.set('Access-Control-Allow-Origin', 'https://pvpivs.com');
    res.set('Access-Control-Allow-Methods', 'POST');
    //console.log("49: Headers working");
    //console.log("reqINSPECT:"+util.inspect(req, {depth: 0}));
    //console.log("req.headersINSPECT:"+util.inspect(req.headers, {depth: null}));
    //console.log("req.headers.x-appengine-user-ipINSPECT:"+util.inspect(req.headers['x-appengine-user-ip'], {depth: null}));
    //console.log("req.bodyINSPECT:"+util.inspect(req.body, {depth: null}));
    console.log("52: req.bodySFY:"+JSON.stringify(req.body));
    if (req.body.token === undefined) {
      //console.error("56: Token undefined");
      // This is an error case, as "message" is required.
      console.error("56: Request missing token, exiting with 400");
      return res.status(400).send('No token received!');
    } else {
      //console.log("61: Token received:"+req.body.token);
      let startVerificationURL = "https://www.google.com/recaptcha/api/siteverify?secret=";
      let endVerificationURL = "&response="+req.body.token+"&remoteip="+req.headers['x-appengine-user-ip'];
      //console.log("64: Asking for reply...");
      accessSecretVersion(startVerificationURL, endVerificationURL, res);
    }
  } catch (error) {
    console.error(error);
    return res.status(418).send('Error');
  }
};