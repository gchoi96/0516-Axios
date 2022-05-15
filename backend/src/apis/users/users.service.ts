import { MailerService } from '@nestjs-modules/mailer';
import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { ICurrentUser } from '../auth/gql-user.param';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { v4 as uuidv4 } from 'uuid';
// import { nodemailer } from 'nodemailer';
import * as nodemailer from 'nodemailer';
import { FindEmailDto } from './dto/find-email.dto';
import { ResetPwdSendMailDTO, UpdatePwdDTO } from './dto/reset-password.dto';
// const nodemailer = require('nodemailer');
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly connection: Connection,
  ) {}

  createUser = async (createUserDto: CreateUserDto) => {
    const isExist = await this.checkUserExists(createUserDto.email);
    if (isExist) {
      throw new UnprocessableEntityException('이미 존재하는 이메일 입니다.');
    }

    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');
    try {
      // const result = this.userRepository.save({ ...createUserDto });
      const user = new User();
      user.email = createUserDto.email;
      user.name = createUserDto.name;
      user.password = createUserDto.password;
      user.nickName = createUserDto.nickName;
      user.year = createUserDto.year;
      user.month = createUserDto.month;
      user.day = createUserDto.day;
      const result = await queryRunner.manager.save(user);

      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  };

  fetchUserById = async (userId: string) => {
    return this.userRepository.findOne({
      where: { id: userId },
    });
  };

  fetchUserByEmail = async (email: any) => {
    return this.userRepository.findOne({ where: { email } });
  };

  loggedInUser = async (currentUser: ICurrentUser) => {
    const user = await this.userRepository.findOne({
      where: { id: currentUser.id },
    });
    return { user };
  };

  findEmail = async (findEmailDto: FindEmailDto): Promise<string> => {
    const email = await this.userRepository
      .findOne({
        where: {
          ...findEmailDto,
        },
      })
      .then((user) => {
        return user ? user.email : '';
      });
    if (!email)
      throw new NotFoundException('일치하는 email이 존재하지 않습니다.');
    return email;
  };

  private checkUserExists = async (email: string): Promise<boolean> => {
    const user = await this.userRepository.findOne({
      where: { email: email },
    });
    console.log(user);
    return user !== null;
  };

  async updateUser(
    updateUserDto: UpdateUserDto,
    currentUser: ICurrentUser,
  ): Promise<User> {
    const result = await this.userRepository.update(
      { id: currentUser.id },
      { ...updateUserDto },
    );

    if (result.affected < 0) throw new ConflictException('회원정보 수정 실패');

    return this.userRepository.findOne({ where: { id: currentUser.id } });
  }

  async deleteUser(currentUser: ICurrentUser): Promise<boolean> {
    const result = await this.userRepository.softDelete({ id: currentUser.id });
    return result.affected > 0;
  }
}
