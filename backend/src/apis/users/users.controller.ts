import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Res,
  HttpStatus,
  UseGuards,
  Query,
  Patch,
  ConflictException,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthAccessGuard } from '../auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from '../auth/gql-user.param';
import { UserResult } from './dto/user-result.dto';
import { LoginResult } from './dto/user-login.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
@ApiTags('회원 정보 API')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/byNickName/:nickName')
  @ApiOperation({
    summary: '유저 정보 조회 API',
    description: '입력받은 유저ID와 일치하는 유저 정보를 조회한다.',
  })
  @ApiOkResponse({
    description: '조회 성공.',
    type: UserResult,
  })
  fetchUserByNickName(@Res() res, @Param('nickName') nickName: string) {
    return this.usersService.fetchUserByNickName(nickName).then((result) => {
      const { password, ...user } = result;
      res.status(HttpStatus.OK).json({ success: true, user: user });
    });
  }

  @Get('/byEmail')
  @ApiOperation({
    summary: '유저 정보 조회 API',
    description: '입력받은 email과 일치하는 유저 정보를 조회한다.',
  })
  @ApiOkResponse({
    description: '조회 성공.',
    type: UserResult,
  })
  fetchUserByEmail(@Res() res, @Query('email') email: string) {
    return this.usersService.fetchUserByEmail(email).then((result) => {
      const { password, ...user } = result;
      res.status(HttpStatus.OK).json({ success: true, user: user });
    });
  }

  @Post()
  @ApiOperation({ summary: '회원 가입 API', description: '유저를 생성한다.' })
  @ApiCreatedResponse({
    description: '회원가입 성공.',
    type: UserResult,
  })
  createUser(@Res() res, @Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto).then((result) => {
      const { password, ...user } = result;
      res.status(HttpStatus.CREATED).json({ success: true, user: user });
    });
  }

  @UseGuards(AuthAccessGuard)
  @Get('loggedInUser')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '로그인 유저 정보 조회 API',
    description: '로그인된 유저 정보를 조회한다.',
  })
  @ApiCreatedResponse({
    description: '조회 성공',
    type: LoginResult,
  })
  loggedInUser(@Res() res, @CurrentUser() currentUser: ICurrentUser) {
    return this.usersService
      .loggedInUser(currentUser)
      .then((result) =>
        res.status(HttpStatus.OK).json({ success: true, ...result }),
      );
  }

  @Get('/findEmail')
  @ApiOperation({
    summary: 'email 찾기 Api',
    description: '입력받은 회원정보와 일치하는 email 조회한다.',
  })
  @ApiOkResponse({
    description: '조회 성공',
    schema: { example: { success: true, email: 'asd@asd.asd' } },
  })
  findEmail(
    @Res() res,
    @Query('nickName') nickName: string,
    @Query('year') year: number,
    @Query('month') month: number,
    @Query('day') day: number,
  ) {
    return this.usersService
      .findEmail({ nickName, year, month, day })
      .then((email) =>
        res.status(HttpStatus.OK).json({ success: true, email }),
      );
  }

  @UseGuards(AuthAccessGuard)
  @Patch('')
  @ApiOperation({
    summary: '회원정보 수정 API',
    description: '입력받은 회원정보로 변경',
  })
  @ApiOkResponse({
    description: '수정 성공',
    type: UserResult,
  })
  updateUser(
    @Res() res,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.usersService
      .updateUser(updateUserDto, currentUser)
      .then((result) => {
        if (!result) throw new ConflictException('회원정보 수정 실패');
        const { password, ...user } = result;
        return res.status(HttpStatus.OK).json({ success: true, user: user });
      });
  }

  @UseGuards(AuthAccessGuard)
  @Delete('')
  @ApiOperation({
    summary: '회원정보 삭제 API',
    description: '로그인중인 회원 정보 삭제',
  })
  @ApiOkResponse({
    description: '삭제 성공',
    schema: { example: { success: true, message: '회원정보 삭제 성공' } },
  })
  deleteUser(@Res() res, @CurrentUser() currentUser: ICurrentUser) {
    return this.usersService.deleteUser(currentUser).then((result) => {
      if (!result) throw new ConflictException('비밀번호 변경 실패');
      return res
        .status(HttpStatus.OK)
        .json({ success: true, message: '회원정보 삭제 성공' });
    });
  }
}
