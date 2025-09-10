import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  // to run code that needs to be ready before the application is usable.
  async onModuleInit() {
    // Connect to the database
    // The PrismaClient can handle this implicitly, but it's good practice
    // to call this explicitly to catch connection errors at startup.
    await this.$connect();
  }

  //NestJS lifecycle hook. Its method
  // is called when the application is gracefully shutting down
  async onModuleDestroy() {
    // Disconnect from the database
    await this.$disconnect();
  }
}
