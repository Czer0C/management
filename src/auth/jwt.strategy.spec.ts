import { JWTStrategy } from './jwt.strategy';
import { UserRepository } from './user.repository';
import { Test } from '@nestjs/testing';
import { User } from './user.entity';
import { UnauthorizedException } from '@nestjs/common';

const mockUserRepository = () => ({
  findOne: jest.fn(),
});

describe('JWTStrategy', () => {
  let jwtStrategy: JWTStrategy;
  let userRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        JWTStrategy,
        {
          provide: UserRepository, useFactory:mockUserRepository
        },
      ],
    }).compile();

    jwtStrategy = await module.get<JWTStrategy>(JWTStrategy);
    userRepository = await module.get<UserRepository>(UserRepository);
  });

  describe('validate', () => {
    it('validates and returns the user based on JWT payload', async () => {
      const user = new User();
      user.username = 'test';

      userRepository.findOne.mockResolvedValue(user);
      const result = await jwtStrategy.validate({username: 'test'});
      expect(userRepository.findOne).toHaveBeenCalledWith({ username: 'test' });
      expect(result).toEqual(user);
    });

    it('throws an unauthorized exception as user cannot be found', () => {
      userRepository.findOne.mockResolvedValue(null);
      expect(jwtStrategy.validate({ username: 'test' })).rejects.toThrow(UnauthorizedException);
    });
  });
});