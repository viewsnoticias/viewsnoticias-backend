
import fs from "node:fs";
import path from "node:path";
import { uploadFile } from "../../../../helpers/uploadFile";

import { v2 as cloudinary } from "cloudinary";
cloudinary.config(
  process.env.CLOUDINARY_URL ??
    "cloudinary://987242662715966:yUlMtQmb9UxCgywKBTC5KX-oRPs@dptbdos97"
);

export default class WriterController {
  public async passwordUpdate({ auth, request, response }) {
    try {
      const writer = auth.user;
      if (!writer) {
        return response.notFound({ msg: "writer not found" });
      }
      const { newPassword, currentPassword } = request.body();
      if (!newPassword || !currentPassword)
        return response.badRequest({ msg: "Todos los campos son requeridos" });
      const passwordVerify = await writer.verifyPassword(currentPassword);
      if (!passwordVerify) {
        return response.badRequest({ msg: "La Contraseña es invalidad" });
      }
      await writer.update({ password: newPassword });

      return {
        msg: "Password updated",
        writerId: writer.email,
        passwordVerify,
        writer: writer.password,
      };
    } catch (err) {
      console.log("writer->update", err);
      return response.badRequest(err);
    }
  }
  public async update({ auth, request, response }) {
    try {
      const writer = auth.user;
      const body = request.body();
      if (body.avatar) {
        await body.avatar.Application.publicPath();
      }
      if (!writer) return response.notFound({ msg: "writer not found" });
      await writer.update(body);
      return {
        msg: "writer updated",
        writer: { email: writer.email, avatar: writer.avatar },
      };
    } catch (err) {
      console.log("writer->update", err);
      return response.badRequest(err);
    }
  }

  public async loadAvatarProfile({ auth, request, response }) {
    const writer = auth.user;
    if (writer.avatar) {
      const ruta = path.join("./public", "", writer.avatar);
      fs.unlink(ruta, (err) => {
        if (err) {
          console.log(err);
        }
      });
    }

    try {
      if (!writer) return response.badRequest({ msg: "unauthorize" });

      const coverImage = request.file("avatar", {
        extnames: ["jpg", "png"],
      });

      if (!coverImage) {
        return response.badRequest({ smg: "Debes cargar una imagen" });
      }

      if (!coverImage.isValid) {
        return response.badRequest({ smg: coverImage.errors });
      }

      if (writer.avatar) {
        const nameArr = writer.avatar.split("/");
        const nameFile = nameArr[nameArr.lenth - 1];
        const [public_id] = nameFile.split(".");
        cloudinary.uploader.destroy(public_id);
      }
      const url = await uploadFile(coverImage.tmpPath);

      // const {secure_url} = await cloudinary.uploader.upload(coverImage.tmpPath)
      // const name = "avatar_" + uuidv4();
      // coverImage.clientName = name.concat(".", coverImage.extname);
      // await coverImage.move(Application.publicPath());

      writer.update({ avatar: url });
      return { msg: "Avatar Update", avatar: writer.avatar };
    } catch (err) {
      console.log("Error al cargar el archivo ah ocurrido un error", err);
      return response.internalServerError(err);
    }
  }
  public async show({ auth }) {
    const writer = auth.user;
    return {
      msg: "writer got",
      data: writer,
    };
  }
}
