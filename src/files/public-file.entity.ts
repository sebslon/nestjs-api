import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class PublicFile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  public url: string;

  @Column()
  public key: string;
}
export default PublicFile;
