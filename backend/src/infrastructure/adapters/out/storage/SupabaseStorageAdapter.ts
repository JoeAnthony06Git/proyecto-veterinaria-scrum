import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { IStorageService, UploadableFile } from '../../../../domain/ports/out/storage/IStorageService';

@Injectable()
export class SupabaseStorageAdapter implements IStorageService {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    const url = this.configService.get<string>('SUPABASE_URL');
    const key = this.configService.get<string>('SUPABASE_KEY');
    console.log('DEBUG SUPABASE URL:', `|${url}|`);
    if (!url || !key) {
      throw new Error('Faltan las variables de entorno SUPABASE_URL o SUPABASE_KEY');
    }

    this.supabase = createClient(url, key);
  }

  async uploadFile(file: UploadableFile, folder: string): Promise<string> {
    const fileName = `${folder}/${Date.now()}-${file.originalname}`;
    
    const { data, error } = await this.supabase.storage
      .from('pets')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false
      });

    if (error) {
      console.error("🛑 ERROR DETALLADO DE SUPABASE:", JSON.stringify(error, null, 2));
      throw new Error(`Error subiendo imagen: ${error.message}`);
    }

    const { data: urlData } = this.supabase.storage
      .from('pets')
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  }
}