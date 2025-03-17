import {
  ForbiddenException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';
import { PersonController } from './person.controller';

let controllerMock: PersonController;

const personServiceMock = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  uploadPicture: jest.fn(),
};

controllerMock = new PersonController(personServiceMock as any);

describe('PersonController', () => {
  describe('create', () => {
    it('create - should create a person and return status 201', async () => {
      // Arrange
      const createPersonDto: CreatePersonDto = {
        name: 'John',
        email: 'john@test.com',
        password: '123456',
      };
      const createdPerson = { id: 1, ...createPersonDto };

      jest.spyOn(personServiceMock, 'create').mockResolvedValue(createdPerson);

      // Act
      const result = await controllerMock.create(createPersonDto);

      // Assert
      expect(personServiceMock.create).toHaveBeenCalledTimes(1);
      expect(personServiceMock.create).toHaveBeenCalledWith(createPersonDto);
      expect(result).toEqual(createdPerson);
      expect(HttpStatus.CREATED).toEqual(201);
    });
  });

  describe('findAll', () => {
    it('should return all persons with status 200', async () => {
      const personsMock = [
        {
          name: 'John',
          email: 'john@test.com',
          password: '123456',
        },
      ];

      jest.spyOn(personServiceMock, 'findAll').mockResolvedValue(personsMock);

      const result = await controllerMock.findAll();

      expect(personServiceMock.findAll).toHaveBeenCalledTimes(1);
      expect(result).toBe(personsMock);
      expect(HttpStatus.OK).toEqual(200);
    });
  });

  describe('findOne', () => {
    it('should return a person when found', async () => {
      const mockId = '1';
      const req = {};
      const personMock = {
        name: 'John',
        email: 'john@test.com',
        password: '123456',
      };

      jest.spyOn(personServiceMock, 'findOne').mockResolvedValue(personMock);

      const result = await controllerMock.findOne(mockId, req as any);

      expect(personServiceMock.findOne).toHaveBeenCalledTimes(1);
      expect(personServiceMock.findOne).toHaveBeenCalledWith(+mockId);
      expect(result).toBe(personMock);
      expect(HttpStatus.OK).toBe(200);
    });

    it('should return 404 if person is not found', async () => {
      const mockId = '1';
      const req = {};

      jest
        .spyOn(personServiceMock, 'findOne')
        .mockRejectedValue(new NotFoundException());

      await expect(controllerMock.findOne(mockId, req as any)).rejects.toThrow(
        NotFoundException,
      );
      expect(HttpStatus.NOT_FOUND).toEqual(404);
    });
  });

  describe('update', () => {
    it('update - should update a person and return the updated object', async () => {
      const mockId = '1';
      const tokenPayloadMock = { sub: 1 } as any;
      const updatePerson = { name: 'John Doe', password: '321654' } as any;
      const updatedPersonMock = { id: +mockId, ...updatePerson };

      jest
        .spyOn(personServiceMock, 'update')
        .mockResolvedValue(updatedPersonMock);

      const result = await controllerMock.update(
        mockId,
        updatePerson,
        tokenPayloadMock,
      );

      expect(personServiceMock.update).toHaveBeenCalledTimes(1);
      expect(personServiceMock.update).toHaveBeenCalledWith(
        +mockId,
        updatePerson,
        tokenPayloadMock,
      );
      expect(result).toEqual(updatedPersonMock);
      expect(HttpStatus.OK).toEqual(200);
    });

    it('should return 403 if user tries to update another user', async () => {
      const mockId = '1';
      const tokenPayloadMock = { sub: 2 } as any;
      const updatePerson = { name: 'John Doe', password: '321654' } as any;

      jest
        .spyOn(personServiceMock, 'update')
        .mockRejectedValue(new ForbiddenException());

      const result = controllerMock.update(
        mockId,
        updatePerson,
        tokenPayloadMock,
      );

      await expect(result).rejects.toThrow(ForbiddenException);
      expect(HttpStatus.FORBIDDEN).toEqual(403);
    });
  });

  describe('remove', () => {
    it('should delete a person and return status 200', async () => {
      const mockId = '1';
      const tokenPayloadMock = { sub: mockId } as any;
      const message = { menssage: `Usuario deletado Id: ${mockId}` };

      jest.spyOn(personServiceMock, 'remove').mockResolvedValue(message);

      const result = await controllerMock.remove(mockId, tokenPayloadMock);

      expect(personServiceMock.remove).toHaveBeenCalledTimes(1);
      expect(personServiceMock.remove).toHaveBeenCalledWith(
        +mockId,
        tokenPayloadMock,
      );
      expect(result).toEqual(message);
      expect(HttpStatus.OK).toEqual(200);
    });

    it('should return 403 if user tries to delete another user', async () => {
      const mockId = '1';
      const tokenPayloadMock = { sub: 2 } as any;

      jest
        .spyOn(personServiceMock, 'remove')
        .mockRejectedValue(new ForbiddenException());

      await expect(
        controllerMock.remove(mockId, tokenPayloadMock),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('upload', () => {
    it('should upload picture and return the updated person', async () => {
      const fileMock = {
        originalname: 'photo.png',
        size: 2000,
        buffer: Buffer.from('file content'),
      } as Express.Multer.File;
      const tokenPayloadMock = { sub: 1 } as any;
      const personMock = {
        id: 1,
        name: 'John',
        email: 'john@test.com',
        password: '123456',
        picture: '1.png',
      };

      jest.spyOn(personServiceMock, 'uploadPicture').mockResolvedValue(personMock);

      const result = await controllerMock.uploadPicture(tokenPayloadMock,fileMock );

      expect(personServiceMock.uploadPicture).toHaveBeenCalledTimes(1);
      expect(personServiceMock.uploadPicture).toHaveBeenCalledWith(fileMock, tokenPayloadMock);
      expect(result).toEqual(personMock);
      expect(HttpStatus.OK).toEqual(200);


    });
  });
});
