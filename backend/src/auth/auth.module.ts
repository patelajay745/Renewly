import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import { ClerkClientProvider } from "src/providers/clerk-client.provider";
import { AuthController } from "./auth.controller";
import { ClerkStrategy } from "./clerk.strategy";
import { ClerkAuthGuard } from "./guards/clerkGuard";

@Module({
    imports: [PassportModule, ConfigModule],
    controllers: [AuthController],
    providers: [ClerkClientProvider, ClerkStrategy, ClerkAuthGuard],
    exports: [PassportModule, ClerkAuthGuard]

})
export class AuthModule { }