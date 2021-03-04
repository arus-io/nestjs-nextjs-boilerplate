import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import { AppLogger } from '../../infra/logger/app.logger';
import { CompanyService } from '../../company/company.service';

@Injectable()
export class CompanyMiddleware implements NestMiddleware {
  constructor(private logger: AppLogger, private service: CompanyService) {}

  async use(_req: Request, res: Response, next: NextFunction) {
    const req: { subdomain: string; subdomains: string[]; companyId: number } = _req as any;
    if (!req.subdomain) {
      // for test, we set subdomain directly. subdomains is a standard field, we cant set it in nest
      if (!req.subdomains || req.subdomains.length !== 1) {
        this.logger.log('Request has no subdomains');
        return res.status(404).end('');
      }
      req.subdomain = req.subdomains[0];
    }
    if (req.subdomain === 'admin') {
      return next();
    }
    //
    try {
      const companyId = await this.service.getIdFromSubdomain(req.subdomain);
      if (companyId) {
        req.companyId = companyId;
        return next();
      } else {
        this.logger.log(`Company not found for subdomain ${req.subdomain}`);
        return res.status(404).end('');
      }
    } catch (e) {
      return next(e);
    }
  }
}
