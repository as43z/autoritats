import { Request, Response } from "express";
import { Certificate, ShareManager } from "../models/share.model";
import * as certUtils from '../utils/certificate.utils';
import { Logger } from "tslog";
const logger = new Logger();
const shareManager: ShareManager = new ShareManager();

export async function addShare(req:Request, res:Response) {
    const {safeUserCertificate, share} = req.body;
    const userCertificate: Certificate | undefined = certUtils.certificateFromSafeJson(safeUserCertificate);
    if(shareManager.addShare(userCertificate!, share)){
        return res.status(200).json({msg: 'ok'});
    } else {
        return res.status(400).json({msg: 'bad'});
    }
}

export async function getShare(req:Request, res:Response) {
    const {safeUserCertificate} = req.body;
    const userCertificate: Certificate | undefined = certUtils.certificateFromSafeJson(safeUserCertificate);
    const share: string | undefined = shareManager.getShare(userCertificate!);
    if(typeof share !== 'undefined')
        return res.status(200).json({share: share});
    else
        return res.status(400).json({msg: 'bad'});
}