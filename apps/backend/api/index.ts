import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';

// Import express from platform-express dependencies
const express = require('express');

// Import from dist after build
const { AppModule } = require('../dist/app.module');

let cachedApp: any;

async function bootstrap() {
  if (!cachedApp) {
    const expressApp = express();
    
    cachedApp = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
      { 
        logger: false,
      }
    );

    cachedApp.enableCors({
      origin: '*',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'Accept',
        'X-Requested-With',
        'X-CSRF-Token',
        'Origin',
      ],
      exposedHeaders: ['Authorization'],
      preflightContinue: false,
      optionsSuccessStatus: 204,
    });

    cachedApp.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      })
    );

    await cachedApp.init();
  }
  return cachedApp;
}

export default async (req: any, res: any) => {
  // Handle CORS preflight manually
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, X-Requested-With, X-CSRF-Token, Origin');
  res.setHeader('Access-Control-Expose-Headers', 'Authorization');

  // Handle OPTIONS preflight request
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  const app = await bootstrap();
  const instance = app.getHttpAdapter().getInstance();
  instance(req, res);
};

