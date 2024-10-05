import { Injectable } from '@nestjs/common';
import { QueryRunner, Repository } from 'typeorm';
import { ImagesModel } from './entity/images.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProfileImage } from './dto/create-profile-image.dto';
import { basename, join } from 'path';
import { PROFILE_FOLDER_PATH, TEMP_FOLDER_PATH } from 'src/common/const/image-path.const';
import { promises } from 'fs';

@Injectable()
export class ImagesService {

    constructor(
        @InjectRepository(ImagesModel)
        private readonly imagesRepository: Repository<ImagesModel>
    ) { }

    getRepository(qr?: QueryRunner) {
        return qr ? qr.manager.getRepository<ImagesModel>(ImagesModel) : this.imagesRepository;
    };



    async createProfileImage(dto: CreateProfileImage, qr?: QueryRunner) {

        const repository = this.getRepository(qr);


        const tempFile = join(
            TEMP_FOLDER_PATH,
            dto.path
        );


        await promises.access(tempFile);

        const newFilePath = basename(tempFile);


        const newFile = join(
            PROFILE_FOLDER_PATH,
            newFilePath
        );


        const result = await repository.save(dto);

        await promises.rename(tempFile, newFile);


        return result;

    };



    async getImageById(id: number) {

        const img = await this.imagesRepository.findOne({
            where: {
                id,
            }
        });

        return img;
    }
}
