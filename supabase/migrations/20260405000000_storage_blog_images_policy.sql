-- Allow public read access to blog-images bucket
CREATE POLICY "Public read access for blog-images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'blog-images');

-- Allow authenticated users to upload to blog-images bucket
CREATE POLICY "Authenticated users can upload blog-images"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'blog-images' AND auth.role() = 'authenticated');

-- Allow authenticated users to update their uploads
CREATE POLICY "Authenticated users can update blog-images"
  ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'blog-images' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete their uploads
CREATE POLICY "Authenticated users can delete blog-images"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'blog-images' AND auth.role() = 'authenticated');
