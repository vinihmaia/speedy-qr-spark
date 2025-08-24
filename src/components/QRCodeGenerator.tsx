import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, QrCode, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const QRCodeGenerator = () => {
  const [text, setText] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [qrType, setQrType] = useState('text');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const generateQRCode = async (value: string) => {
    if (!value.trim()) {
      setQrCodeUrl('');
      return;
    }

    try {
      const url = await QRCode.toDataURL(value, {
        width: 300,
        margin: 2,
        color: {
          dark: '#1a1a1a',
          light: '#ffffff',
        },
        errorCorrectionLevel: 'M',
      });
      setQrCodeUrl(url);
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar o QR Code",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    generateQRCode(text);
  }, [text]);

  const handleDownload = () => {
    if (!qrCodeUrl) return;

    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = 'qrcode.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Download concluído",
      description: "QR Code salvo com sucesso!",
    });
  };

  const handleCopy = async () => {
    if (!qrCodeUrl) return;

    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          'image/png': blob
        })
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copiado!",
        description: "QR Code copiado para a área de transferência",
      });
    } catch (error) {
      console.error('Erro ao copiar:', error);
      toast({
        title: "Erro",
        description: "Não foi possível copiar o QR Code",
        variant: "destructive",
      });
    }
  };

  const getPlaceholder = () => {
    switch (qrType) {
      case 'url':
        return 'https://exemplo.com';
      case 'email':
        return 'contato@exemplo.com';
      case 'phone':
        return '+55 11 99999-9999';
      case 'wifi':
        return 'WIFI:T:WPA;S:NomeRede;P:senha123;;';
      default:
        return 'Digite seu texto aqui...';
    }
  };

  const formatText = (value: string, type: string) => {
    switch (type) {
      case 'email':
        return value.includes('mailto:') ? value : `mailto:${value}`;
      case 'phone':
        return value.includes('tel:') ? value : `tel:${value}`;
      case 'url':
        return value.startsWith('http') ? value : `https://${value}`;
      default:
        return value;
    }
  };

  const handleTextChange = (value: string) => {
    setText(value);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <QrCode className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Gerador de QR Code
          </h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Crie QR Codes personalizados para URLs, textos, e-mails, telefones e muito mais. 
          Ferramenta profissional e gratuita para seu portfólio digital.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/50">
          <CardHeader>
            <CardTitle>Configurações</CardTitle>
            <CardDescription>
              Escolha o tipo e insira o conteúdo do seu QR Code
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo de QR Code</Label>
              <Select value={qrType} onValueChange={setQrType}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Texto</SelectItem>
                  <SelectItem value="url">URL/Site</SelectItem>
                  <SelectItem value="email">E-mail</SelectItem>
                  <SelectItem value="phone">Telefone</SelectItem>
                  <SelectItem value="wifi">WiFi</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Conteúdo</Label>
              {qrType === 'text' || qrType === 'wifi' ? (
                <Textarea
                  id="content"
                  placeholder={getPlaceholder()}
                  value={text}
                  onChange={(e) => handleTextChange(e.target.value)}
                  className="min-h-[120px]"
                />
              ) : (
                <Input
                  id="content"
                  placeholder={getPlaceholder()}
                  value={text}
                  onChange={(e) => handleTextChange(e.target.value)}
                />
              )}
            </div>

            {qrType === 'wifi' && (
              <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                <p className="font-medium mb-1">Formato WiFi:</p>
                <p>WIFI:T:WPA;S:NomeRede;P:senha123;;</p>
                <p className="mt-1">T=Tipo (WPA/WEP), S=Nome da rede, P=Senha</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/50">
          <CardHeader>
            <CardTitle>QR Code Gerado</CardTitle>
            <CardDescription>
              Seu QR Code aparecerá aqui automaticamente
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              {qrCodeUrl ? (
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg shadow-inner">
                    <img 
                      src={qrCodeUrl} 
                      alt="QR Code gerado" 
                      className="w-64 h-64 mx-auto"
                    />
                  </div>
                  <div className="flex gap-2 justify-center">
                    <Button 
                      onClick={handleDownload}
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleCopy}
                      className="flex items-center gap-2"
                    >
                      {copied ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                      {copied ? 'Copiado!' : 'Copiar'}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center w-64 h-64 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                  <QrCode className="h-16 w-16 text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground mt-2 text-center">
                    Digite algo para gerar<br />seu QR Code
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};