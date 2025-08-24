import { QRCodeGenerator } from '@/components/QRCodeGenerator';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-12">
        <QRCodeGenerator />
      </div>
    </div>
  );
};

export default Index;
