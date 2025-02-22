import passport from "passport";
import { Request } from "express";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import config from "./app.config";
import { BadRequestError } from "../utils/AppError";
import {
    loginOrCreateAccountService,
    verifyUserService,
} from "../services/auth.service";
import { ProviderEnum } from "../enums/providerEnum";

// Google Strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: config.GOOGLE_CLIENT_ID,
            clientSecret: config.GOOGLE_CLIENT_SECRET,
            callbackURL: config.GOOGLE_CALLBACK_URL,
            scope: ["profile", "email"],
            passReqToCallback: true,
        },
        async (req: Request, accessToken, refreshToken, profile, done) => {
            try {
                const { email, sub: googleId, picture } = profile._json;
                if (!googleId) {
                    throw new BadRequestError("Google ID (sub) is missing");
                }

                const { user } = await loginOrCreateAccountService({
                    provider: ProviderEnum.GOOGLE,
                    name: profile.displayName,
                    providerId: googleId,
                    picture: picture,
                    email: email as string,
                });
                done(null, user);
            } catch (error) {
                done(error, false);
            }
        }
    )
);

// Local Strategy
passport.use(
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password",
            session: true,
        },
        async (email, password, done) => {
            try {
                const user = await verifyUserService({ email, password });
                return done(null, user);
            } catch (error: any) {
                return done(error, false, { message: error?.message });
            }
        }
    )
);

passport.serializeUser((user: any, done) => done(null, user));
passport.deserializeUser((user: any, done) => done(null, user));
