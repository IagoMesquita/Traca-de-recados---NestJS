import { Person } from 'src/person/entities/person.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('message')
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  text: string;

  @Column({ default: false })
  isRead: boolean;

  // Muitas recados podem ser enviados por usa unica pessoa (emissor)
  @ManyToOne(() => Person)
  @JoinColumn({ name: 'from' }) // -> Especifica a coluna "de" que armazena o ID da pessoa que enviou o recado
  from: Person;

  // Muitas recados podem ser recebidos por usa unica pessoa (destinatario)
  @ManyToOne(() => Person)
  @JoinColumn({ name: 'to' })
  to: string;

  @CreateDateColumn()
  createDate?: Date;

  @UpdateDateColumn()
  updadeDare?: Date;
}
