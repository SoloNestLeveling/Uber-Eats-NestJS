import { InjectRepository } from "@nestjs/typeorm";
import { ProfileModel } from "./entity/profile.entity";
import { QueryRunner, Repository } from "typeorm";
import { CreateProfileDto } from "./dto/create-profile.dto";
import { ImagesService } from "src/images/images.service";
import { ImagesTypeEnum } from "src/images/enum/images.enum";
import { BadRequestException } from "@nestjs/common";

export class ProfileService {

    constructor(
        @InjectRepository(ProfileModel)
        private readonly profileRepository: Repository<ProfileModel>,
        private readonly imagesService: ImagesService
    ) { }


    getRepository(qr?: QueryRunner) {
        return qr ? qr.manager.getRepository<ProfileModel>(ProfileModel) : this.profileRepository
    }

    async createProfile(dto: CreateProfileDto, userId: number, qr?: QueryRunner) {


        const repository = this.getRepository(qr)

        const existNickname = await repository.exists({
            where: {
                nickname: dto.nickname
            }
        });

        if (existNickname) {
            throw new BadRequestException("이미 존재하는 닉네임 입니다.")
        }


        const profile = repository.create({
            user: {
                id: userId
            },
            nickname: dto.nickname,
        });


        const savedProfile = await repository.save(profile);



        if (dto.image === null) {

            return savedProfile;
        };


        await this.imagesService.createProfileImage({
            order: 1,
            type: ImagesTypeEnum.PROFILE,
            path: dto.image,
            profile,
        }, qr);

        console.log()

        return savedProfile;

    };


    async getProfileById(id: number, qr?: QueryRunner) {

        const repository = this.getRepository(qr)

        const profile = await repository.findOne({
            where: {
                id,
            },
            relations: ['image']
        });

        return profile;
    }
}