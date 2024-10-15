import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('sensor_data')  
export class SensorData {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column({ type: 'varchar', name: 'ident' })  
  ident: string;

  @Column({ type: 'float', nullable: true })
  temperature: number;

  @Column({ type: 'float', nullable: true }) // Add weight property
  weight: number;

  @Column({ type: 'timestamp', name: 'timestamp' })
  timestamp: Date; 
}
