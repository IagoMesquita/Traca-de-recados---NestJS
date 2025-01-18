import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('recado')
export class Recado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  texto: string;
  
  @Column({ length: 50 })
  de: string;
  
  @Column({ length: 50 })
  para: string;
  
  @Column({default: false})
  lido: boolean;

  @CreateDateColumn()
  createDate?: Date;

  @UpdateDateColumn()
  updadeDare?: Date;
}