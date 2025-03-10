import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Procedure, ProcedureDocument } from './procedure.schema';
import { CreateProcedureDto } from './dto/create-procedure.dto';
import { UpdateProcedureDto } from './dto/update-procedure.dto';

@Injectable()
export class ProceduresService {
  constructor(
    @InjectModel(Procedure.name)
    private procedureModel: Model<ProcedureDocument>,
  ) {}

  async create(createProcedureDto: CreateProcedureDto): Promise<Procedure> {
    const createdProcedure = new this.procedureModel(createProcedureDto);
    return createdProcedure.save();
  }

  async findAll(): Promise<Procedure[]> {
    return this.procedureModel.find().exec();
  }

  async findOne(id: string): Promise<Procedure> {
    const procedure = await this.procedureModel.findById(id).exec();
    if (!procedure) {
      throw new NotFoundException(`Procedure with ID ${id} not found`);
    }
    return procedure;
  }

  async update(
    id: string,
    updateProcedureDto: UpdateProcedureDto,
  ): Promise<Procedure> {
    const updatedProcedure = await this.procedureModel
      .findByIdAndUpdate(id, updateProcedureDto, { new: true })
      .exec();
    if (!updatedProcedure) {
      throw new NotFoundException(`Procedure with ID ${id} not found`);
    }
    return updatedProcedure;
  }

  async remove(id: string): Promise<Procedure> {
    const deletedProcedure = await this.procedureModel
      .findByIdAndDelete(id)
      .exec();
    if (!deletedProcedure) {
      throw new NotFoundException(`Procedure with ID ${id} not found`);
    }
    return deletedProcedure;
  }
}
