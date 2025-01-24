import { IsEmail } from "class-validator";
import { Message } from "src/messages/entities/message";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Person {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true }) 
  @IsEmail()
  email: string;

  @Column({ length: 255 })
  passwordHash: string;

  @Column({ length: 100 })
  name: string;

  // Uma pessoa pode ter enviado muitos recados como from
  // Esses recados sao realacionados ao compo from na entidade message 
  @OneToMany(() => Message, (message: Message) => message.from)
  messagesSent: Message[]

  // Uma pessoa pode ter recebido muitos recados como from
  // Esses recados sao realacionados ao compo to na entidade message 
  @OneToMany(() => Message, (message: Message) => message.to)
  messagesReceived: Message[]

  @CreateDateColumn()
  createDate?: Date;

  @UpdateDateColumn()
  updadeDare?: Date;
}


