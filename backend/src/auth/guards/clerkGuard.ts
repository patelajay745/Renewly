import { ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";
import { IS_PROTECTED_KEY } from "../../decorators/protected.decorator";

@Injectable()
export class ClerkAuthGuard extends AuthGuard("clerk") {
    constructor(private reflector: Reflector) {
        super()
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const isProtected = this.reflector.getAllAndOverride<boolean>(IS_PROTECTED_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!isProtected) {
            return true;
        }

        return super.canActivate(context);
    }
}