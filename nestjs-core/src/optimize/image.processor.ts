import * as AdmZip from 'adm-zip';
import imagemin from 'imagemin';
import imageminPngquant from 'imagemin-pngquant';
import { Job, DoneCallback } from 'bull';

// Running jobs in separate processes
// we execute our image processor in a forked process, the dependency injection isn’t available.
// If we would need some dependencies, we would need to initialize them.

async function imageProcessor(job: Job, doneCallback: DoneCallback) {
  const files: Express.Multer.File[] = job.data.files;

  const optimizationPromises: Promise<Buffer>[] = files.map((file) => {
    const fileBuffer = Buffer.from(file.buffer);
    return imagemin.buffer(fileBuffer, {
      plugins: [
        imageminPngquant({
          quality: [0.6, 0.8],
        }),
      ],
    });
  });

  const optimizedImages = await Promise.all(optimizationPromises);

  const zip = new AdmZip();

  optimizedImages.forEach((image, index) => {
    const fileData = files[index];
    zip.addFile(fileData.originalname, image);
  });

  doneCallback(null, zip.toBuffer());
}

export default imageProcessor;
