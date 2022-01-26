import { generateRSAKeys, RSAPrivateKey, RSAPublicKey } from "@big3/ciber-modules";
import { bigintToHex, hexToBigint, bigintToText } from "bigint-conversion";
import {Logger} from "tslog";
import { genDniId } from "../utils/id.utils";

export class Certificate{
    private _pubKey : RSAPublicKey;
    private _serverSignature : bigint;
    private _logger: Logger;

    constructor (pubKey: RSAPublicKey, serverSignature: bigint) {
        this._pubKey = pubKey;
        this._serverSignature = serverSignature;
        this._logger = new Logger();
    }

    getSafeJsonCertificate(): any {
        this._logger.info(`Getting JSON safe Certificate`);
        var safeCertificate = {
            publicKey: this.getJsonSafePubKey(),
            serverSignature: this.getJsonSafeServerSignature()
        };
        return safeCertificate;
    }

    getJsonSafePubKey(): any {
        this._logger.info(`GETTING SAFE JSON KEY`);
        var safeKey = {
            e: bigintToHex(this._pubKey.getExpE()),
            n: bigintToHex(this._pubKey.getModN())
        }
        return safeKey;
    }

    getPubKey(): RSAPublicKey{
        return this._pubKey;
    }

    getJsonSafeServerSignature(): any {
        this._logger.info(`GETTING SAFE JSON SIGNATURE`);
        var safeSignature = bigintToHex(this._serverSignature);
        return safeSignature;
    }

    getServerSignature(): bigint{
        return this._serverSignature;
    }
}

export class ShareManager{
    private _shares: Map<Certificate, string> = new Map<Certificate, string>();

    constructor(){

    }

    getShare(userCertificate: Certificate): string | undefined{
        return this._shares.get(userCertificate);
    }

    addShare(userCertificate: Certificate, share: string): Boolean {
        if(this._shares.has(userCertificate))
            return false;
        else{
            this._shares.set(userCertificate, share);
            return true;
        }
    }
}