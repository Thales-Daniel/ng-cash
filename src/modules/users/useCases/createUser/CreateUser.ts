import prisma from "../../../../database/client"
import CreateUserTypes from "../../Types/CreateUserType"
import { ErrorApp } from "../../../../middlewares/ErrorApp"
import bcrypt from "bcrypt"

export class CreateUser {
  async execute({ username, password }: CreateUserTypes) {
    const userAlreadyExists = await prisma.users.findFirst({
      where: {
        username,
      },
    })

    if (userAlreadyExists) throw new ErrorApp("User Alredy exists", 400)

    const idAccount = await prisma.accounts.create({
      data: {
        balance: 100,
      },
    })

    const hashPassword = await bcrypt.hash(password, 10)

    const user = await prisma.users.create({
      data: {
        username,
        password: hashPassword,
        accountId: idAccount.id,
      },
    })

    return {
      id: user.id,
      username,
      accountId: user.accountId,
    }
  }
}
