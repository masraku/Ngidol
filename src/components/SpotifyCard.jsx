import { Card, Button } from 'react-bootstrap';
import { PlayFill, Spotify } from 'react-bootstrap-icons';

export default function SpotifyCard({ song }) {
  // Fungsi untuk mengkonversi Spotify URL menjadi Embed URL
  const getSpotifyEmbedUrl = (url) => {
    try {
      // Mengambil track ID dari berbagai format URL Spotify
      let trackId = '';
      
      if (url.includes('open.spotify.com/track/')) {
        trackId = url.split('track/')[1].split('?')[0];
      } else if (url.includes('spotify:track:')) {
        trackId = url.split('spotify:track:')[1];
      }
      
      if (trackId) {
        return `https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`;
      }
      
      return null;
    } catch (error) {
      console.error('Error parsing Spotify URL:', error);
      return null;
    }
  };

  const embedUrl = getSpotifyEmbedUrl(song.spotifyUrl);

  return (
    <Card className="spotify-card shadow-sm h-100">
      <Card.Body className="d-flex flex-column">
        <Card.Title className="d-flex align-items-center gap-2">
          <Spotify className="text-success" />
          {song.title}
        </Card.Title>
        
        {song.artist && (
          <Card.Subtitle className="mb-3 text-muted">
            {song.artist}
          </Card.Subtitle>
        )}

        {embedUrl ? (
          <div className="ratio ratio-16x9 mt-auto mb-3">
            <iframe
              src={embedUrl}
              width="100%"
              height="152"
              frameBorder="0"
              allowtransparency="true"
              allow="encrypted-media"
              loading="lazy"
              title={`Spotify player for ${song.title}`}
              style={{
                borderRadius: '12px'
              }}
            />
          </div>
        ) : (
          // Fallback jika embed tidak bisa dimuat
          <div className="spotify-fallback text-center py-4 mt-auto mb-3">
            <div className="bg-light rounded p-4">
              <PlayFill size={48} className="text-success mb-3" />
              <p className="mb-3">Preview tidak tersedia</p>
              <Button 
                href={song.spotifyUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                variant="success"
                size="sm"
              >
                <Spotify className="me-2" />
                Buka di Spotify
              </Button>
            </div>
          </div>
        )}

        {/* Tombol buka di Spotify selalu ada */}
        <div className="text-center">
          <Button 
            href={song.spotifyUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            variant="outline-success"
            size="sm"
          >
            <Spotify className="me-2" />
            Dengarkan di Spotify
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}