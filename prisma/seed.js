"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var date_fns_1 = require("date-fns"); // Puedes usar esta función de date-fns para manipular fechas
var prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var today, endDate, client, user, event;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    today = new Date("2025-09-09T21:02:30.078Z");
                    endDate = (0, date_fns_1.addYears)(today, 1);
                    return [4 /*yield*/, prisma.client.upsert({
                            where: { email: "client@yendo.com" },
                            update: {},
                            create: {
                                name: "Cliente de Prueba",
                                email: "client@yendo.com",
                                city: "Rosario",
                            },
                        })];
                case 1:
                    client = _a.sent();
                    return [4 /*yield*/, prisma.user.upsert({
                            where: { email: "cannibal5033@gmail.com" },
                            update: {},
                            create: {
                                id: "cm0vhobsu00039p6awxcj4dmt",
                                name: "cuerojr jr",
                                email: "cannibal5033@gmail.com",
                                image: "https://lh3.googleusercontent.com/a/ACg8ocJK50KlLj5zqozLrTk8eXu1T74gYes-IYBQ6jHX2Bosbx-nCDo=s96-c",
                                type: "SUPERADMIN",
                                createdAt: new Date("2025-09-09T21:02:30.078Z"),
                                clientId: client.id, // 👈 ahora requerido
                            },
                        })];
                case 2:
                    user = _a.sent();
                    return [4 /*yield*/, prisma.userConfiguration.upsert({
                            where: { userId: user.id },
                            update: {},
                            create: {
                                userId: user.id,
                                mpAccessToken: "test_token_123",
                                eventSoldOutNotification: true,
                                ticketTypeSoldOutNotification: true,
                                eventToBeSoldOutNotification: false,
                                ticketTypePublishedNotification: false,
                                serviceCharge: 5,
                                maxInvitesAmount: 10,
                                maxValidatorsAmount: 2,
                                maxTicketsAmount: 200,
                            },
                        })];
                case 3:
                    _a.sent();
                    // Crear la cuenta vinculada al usuario
                    return [4 /*yield*/, prisma.account.upsert({
                            where: {
                                provider_providerAccountId: {
                                    provider: "google",
                                    providerAccountId: "115806265136504999654",
                                },
                            },
                            update: {},
                            create: {
                                userId: user.id,
                                type: "oauth",
                                provider: "google",
                                providerAccountId: "115806265136504999654",
                                access_token: "a0AeXRPp6kv7CMDcIUkzTbTz2qyjf70179ZLZLd3Jct59cfoAA6NNXD9qKkg2dVdezTCoPDVT2uIpTl7Fbc2V4j7d7BKffifJH4hsbw5T091Q1lOxx53Xxt8JFyEGRjziqdmD8DLt16YePL71ZG17JuQ9B7DXMVD1qbfQdDLR1aCgYKAc0SARESFQHGX2Mi1BAUzLUqLTccsmpr7fBYqw0175",
                                expires_at: 1742594718,
                                token_type: "Bearer",
                                scope: "openid https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
                                id_token: "yJhbGciOiJSUzI1NiIsImtpZCI6ImVlMTkzZDQ2NDdhYjRhMzU4NWFhOWIyYjNiNDg0YTg3YWE2OGJiNDIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIxNjc0ODg2Nzk3NDMtNTUwMGR0Nmp2anRmcnIxdWlqa3M2ajg4cWNhNmE4Z2wuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIxNjc0ODg2Nzk3NDMtNTUwMGR0Nmp2anRmcnIxdWlqa3M2ajg4cWNhNmE4Z2wuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTU4MDYyNjUxMzY1MDQ5OTk2NTQiLCJlbWFpbCI6ImNhbm5pYmFsNTAzM0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6IjY0NC1HYjBxLVdsNU51RThDM3h0V2ciLCJuYW1lIjoiY3Vlcm9qciBqciIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NKSzUwS2xMajV6cW96THJUazhlWHUxVDc0Z1llcy1JWUJRNmpIWDJCb3NieC1uQ0RvPXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6ImN1ZXJvanIiLCJmYW1pbHlfbmFtZSI6ImpyIiwiaWF0IjoxNzQyNTkxMTE5LCJleHAiOjE3NDI1OTQ3MTl9.hXiG5XpWF-VzN3b6jwdPbcmWxw5YODQNbSmCeyRTIqbJwsHXuGRHxjuFDIsNAjUdSMGQNC2ZVqo9UIWGOlCpgkGCu8AI2bBGrhO8f1tNnU1pjlYriJVtugHjZ1n2gMnm_bdmAmGVkBKuMtU1v6L8Wkwbs05ZRT9ueOqGU6P10MTIB8MZbA0nOpT9Ot-QqpGPKlHXvIOrgnv1cNEN4OGXy8hX-1kIZYZlucwlSGRQGHaCkS_xP8hHuVepaMn52DfkpN_ashJeaJizf2xB8oUyW80xNF3PqLhUraAFpAHLsrb-g4mi1Sl-TkvG_4YsHFk_c6oWyXnp10A15yrBgG78lw...",
                            },
                        })];
                case 4:
                    // Crear la cuenta vinculada al usuario
                    _a.sent();
                    return [4 /*yield*/, prisma.event.create({
                            data: {
                                title: "Concierto de Prueba",
                                description: "Un concierto de prueba para el sistema de ticketing",
                                address: "Dirección de prueba 123",
                                location: "Rosario, Argentina",
                                status: "ACTIVE",
                                userId: user.id, // Usamos el usuario que creamos arriba
                                dates: JSON.stringify([{ id: 0, date: "2025-10-17T20:03" }]), // Formato JSON para el campo dates en Event
                                endDate: endDate.toISOString(), // Convertir endDate a formato ISO string
                                ticketTypes: {
                                    create: [
                                        {
                                            title: "Entrada General",
                                            price: 500,
                                            status: "ACTIVE",
                                            type: "NORMAL",
                                            quantity: 100,
                                            position: 1,
                                            dates: JSON.stringify([{ id: 0, date: "2024-10-18T20:03" }]), // Formato JSON para el campo dates en TicketType
                                        },
                                        {
                                            title: "Entrada VIP",
                                            price: 1000,
                                            status: "ACTIVE",
                                            type: "NORMAL",
                                            quantity: 50,
                                            position: 2,
                                            dates: JSON.stringify([{ id: 0, date: "2024-10-19T20:03" }]), // Formato JSON para el campo dates en TicketType
                                        },
                                    ],
                                },
                            },
                        })];
                case 5:
                    event = _a.sent();
                    console.log("User, Account, Event, and TicketTypes created:", {
                        user: user,
                        event: event,
                    });
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error(e);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
