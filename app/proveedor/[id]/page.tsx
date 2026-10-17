import { VyntoApp } from '@/components/vynto-app';
export default async function Profile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <VyntoApp view="profile" providerId={id} />;
}
