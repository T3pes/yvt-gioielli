import PieceForm from "@/components/admin/PieceForm";

export default async function ModificaPezzo({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PieceForm pieceId={id} />;
}
