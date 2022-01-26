import { RSAPrivateKey, RSAPublicKey } from "@big3/ciber-modules";
import { Certificate } from "../models/share.model";
import { hexToBigint, textToBigint } from "bigint-conversion";
import {Logger} from 'tslog';
const logger = new Logger();

export function createCertificate(userPubKey: RSAPublicKey, serverPrivateKey: RSAPrivateKey, blindCipher: string): [boolean, Certificate]{
    try
    {
        logger.info(`Issue New Certificate.`);
        return [true, new Certificate(userPubKey, serverPrivateKey.sign(hexToBigint(blindCipher)))]
    }
    catch (err)
    {
        logger.error(err);
        return [false, <Certificate>{}]
    }
}

export function certificateFromSafeJson(safeCertificate: any): Certificate | undefined{
    logger.info(`Parsing Certificate`);
    var {safePublicKey, serverSignature} = safeCertificate;

    if (typeof safePublicKey === 'undefined' || typeof serverSignature === 'undefined'){
        logger.error('Properties might be undefined');
        return undefined;
    } else {
        const pubKey: RSAPublicKey | undefined = rsaPubKeyFromHex(safePublicKey);
        if (typeof pubKey === 'undefined'){
            logger.error('PubKey is undefined');
            return undefined;
        } else {
            const certificate: Certificate = new Certificate(pubKey, hexToBigint(serverSignature));
            logger.info(`Certificate Parsed.`);
            return certificate;
        }
    }
}

export function rsaPubKeyFromHex(jsonSafeKey: any): RSAPublicKey | undefined{
    const {e, n} = jsonSafeKey;
    logger.info(`Parsing new Public Key`);
    if(typeof e === 'undefined' || typeof n === 'undefined'){
        logger.error(`Properties might be undefined.`);
        return undefined;
    } else {
        logger.info(`Key Parsed.`);
        return new RSAPublicKey(hexToBigint(e), hexToBigint(n));
    }
}

export function verifySignature(receivedSign: bigint, serverPublicKey: RSAPublicKey): Boolean{
    logger.info(`Verifying signature.`);

    let success:boolean=false;
    
    if (serverPublicKey.verify(receivedSign)==serverPublicKey.getExpE()){
        logger.info(`Verified.`);
        success=true;
    } else {
        logger.warn(`Could not verify.`);
    }
    
    return success;
}