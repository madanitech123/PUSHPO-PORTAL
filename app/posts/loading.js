import { IconFile } from '@/components/icons';

export default function PostsLoading() {
  return (
    <div className="container-wide py-24 flex flex-col items-center justify-center text-center">
      <div className="w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-4 animate-pulse">
        <IconFile className="w-6 h-6 text-white" />
      </div>
      <p className="text-gray-400 text-sm animate-pulse">পোস্ট লোড হচ্ছে...</p>
    </div>
  );
}
