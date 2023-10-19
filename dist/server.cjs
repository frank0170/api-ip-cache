"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const axios_1 = __importDefault(require("axios"));
const modelIp_1 = __importDefault(require("./modelIp.cjs"));
const app = (0, express_1.default)();
const PORT = 5080;
mongoose_1.default.connect("mongo-url");
app.use(express_1.default.json());
app.use((req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const ip = req.query.ip;
    const cachedInfo = yield modelIp_1.default.findOne({ ip });
    if (
      cachedInfo &&
      cachedInfo.createdAt >= new Date(new Date().getTime() - 60000)
    ) {
      res.json(cachedInfo.info);
    } else {
      try {
        const response = yield axios_1.default.get(`http://ipwho.is/${ip}`);
        const info = response.data;
        yield modelIp_1.default.findOneAndUpdate(
          { ip },
          { info, createdAt: new Date() },
          { upsert: true }
        );
        res.json(info);
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch IP info" });
      }
    }
  })
);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
//# sourceMappingURL=server.js.map
