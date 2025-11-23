import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
} from 'typeorm';

@Entity()
export class Image {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text' })
    data: string; // base64 encoded image data

    @Column()
    mimeType: string; // e.g., 'image/png', 'image/jpeg'

    @Column({ nullable: true })
    filename: string;

    @CreateDateColumn()
    createdAt: Date;
}

