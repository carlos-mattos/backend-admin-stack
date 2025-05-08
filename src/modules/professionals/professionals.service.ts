import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Professional, ProfessionalDocument } from './professionals.schema';
import { CreateProfessionalDto } from './dto/create-professional.dto';
import { UpdateProfessionalDto } from './dto/update-professional.dto';
import { Service } from '../services/services.schema';

@Injectable()
export class ProfessionalsService {
  constructor(
    @InjectModel(Professional.name)
    private professionalModel: Model<ProfessionalDocument>,
  ) {}

  async create(
    createProfessionalDto: CreateProfessionalDto,
  ): Promise<Professional> {
    const createdProfessional = new this.professionalModel(
      createProfessionalDto,
    );
    return createdProfessional.save();
  }

  async findAll(): Promise<Professional[]> {
    return this.professionalModel
      .find()
      .populate('serviceHandled')
      .populate('schedules')
      .exec();
  }

  async findOne(id: string): Promise<Professional> {
    const professional = await this.professionalModel
      .findById(id)
      .populate('serviceHandled')
      .populate('schedules')
      .exec();
    if (!professional) {
      throw new NotFoundException(`Professional with ID ${id} not found`);
    }
    return professional;
  }

  async update(
    id: string,
    updateProfessionalDto: UpdateProfessionalDto,
  ): Promise<Professional> {
    const updatedProfessional = await this.professionalModel
      .findByIdAndUpdate(id, updateProfessionalDto, { new: true })
      .populate('serviceHandled')
      .populate('schedules')
      .exec();
    if (!updatedProfessional) {
      throw new NotFoundException(`Professional with ID ${id} not found`);
    }
    return updatedProfessional;
  }

  async remove(id: string): Promise<Professional> {
    const deletedProfessional = await this.professionalModel
      .findByIdAndDelete(id)
      .exec();
    if (!deletedProfessional) {
      throw new NotFoundException(`Professional with ID ${id} not found`);
    }
    return deletedProfessional;
  }

  async getServicesByProfessionalId(id: string): Promise<Service[]> {
    const professional = await this.professionalModel
      .findById(id)
      .populate('serviceHandled')
      .exec();

    if (!professional) {
      throw new NotFoundException(`Professional with ID ${id} not found`);
    }

    return professional.serviceHandled as Service[];
  }
}
