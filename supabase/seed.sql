-- Seed Categories
INSERT INTO public.categories (id, name, description, image_url) VALUES
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567801', 'Marketing', 'Prompts for marketers and copywriters', 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=400'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567802', 'Development', 'Prompts for software engineers', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=400'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567803', 'Legal', 'Prompts for lawyers and legal professionals', 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=400');

-- Seed Prompts
INSERT INTO public.prompts (id, title, content, category_id) VALUES
  ('f1e2d3c4-b5a6-7890-abcd-ef1234567811', 'Social Media Ad Copy', 'Write a compelling Facebook ad copy for a [Product/Service]. The target audience is [Audience]. Emphasize [Benefit 1] and [Benefit 2]. Make it engaging and include a strong call to action.', 'a1b2c3d4-e5f6-7890-abcd-ef1234567801'),
  ('f1e2d3c4-b5a6-7890-abcd-ef1234567812', 'Blog Outline Generator', 'Generate a comprehensive blog post outline about [Topic]. Include an introduction, at least 4 main sections with sub-points, and a conclusion.', 'a1b2c3d4-e5f6-7890-abcd-ef1234567801'),
  ('f1e2d3c4-b5a6-7890-abcd-ef1234567813', 'React Component Refactoring', 'Refactor the following React component to use modern functional hooks and improve its readability: \n[Insert Code]', 'a1b2c3d4-e5f6-7890-abcd-ef1234567802'),
  ('f1e2d3c4-b5a6-7890-abcd-ef1234567814', 'SQL Query Optimization', 'Analyze this SQL query and provide an optimized version. Explain the changes made: \n[Insert SQL]', 'a1b2c3d4-e5f6-7890-abcd-ef1234567802'),
  ('f1e2d3c4-b5a6-7890-abcd-ef1234567815', 'Contract Clause Summary', 'Summarize the following legal clause into plain English so that a non-lawyer can understand the primary obligations and risks: \n[Insert Clause]', 'a1b2c3d4-e5f6-7890-abcd-ef1234567803');
