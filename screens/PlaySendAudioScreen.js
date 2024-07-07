import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, Text, TextInput, Button, TouchableOpacity } from 'react-native';
import { Provider as PaperProvider, Appbar, Card } from 'react-native-paper';
import * as DocumentPicker from 'expo-document-picker';
import { Picker } from '@react-native-picker/picker';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlay, faStop, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons'; 
import AudioUpload from './AudioUpload'

const PlaySendAudio = () => {
  const [audioContext, setAudioContext] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [songs, setSongs] = useState([]);
  const [selectedSong, setSelectedSong] = useState('');
  const [newSongName, setNewSongName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      await fetchSongs();
    };
    fetchData();
    return () => {};
  }, []);

  const fetchSongs = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/list-songs');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setSongs(data.songs);
      setSelectedSong(data.songs[0]);
    } catch (error) {
      console.error('Error fetching songs:', error);
    }
  };

  useEffect(() => {
    if (audioChunks.length > 0 && audioContext) {
      const playAudioChunks = async () => {
        for (const buffer of audioChunks) {
          const source = audioContext.createBufferSource();
          source.buffer = buffer;
          source.connect(audioContext.destination);
          source.start(0);
          await new Promise((resolve) => {
            source.onended = resolve;
          });
        }
        setAudioChunks([]);
      };
      playAudioChunks();
    }
  }, [audioChunks, audioContext]);

  const playSong = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/play-song', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ song: selectedSong }),
        mode: 'cors',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log(data.message);
    } catch (error) {
      console.error('Error playing song:', error);
    }
  };

  const stopSong = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/stop-song', {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      console.log('Song stopped');
    } catch (error) {
      console.error('Error stopping song:', error);
    }
  };

  const deleteSong = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/delete-song', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ song: selectedSong }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log(data.message);
      await fetchSongs(); // Refresh song list
    } catch (error) {
      console.error('Error deleting song:', error);
    }
  };

  const renameSong = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/rename-song', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ oldName: selectedSong, newName: newSongName }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log(data.message);
      await fetchSongs(); // Refresh song list
    } catch (error) {
      console.error('Error renaming song:', error);
    }
  };

  const handleFilePick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        copyToCacheDirectory: true,
      });

      if (result.type === 'success') {
        setSelectedFile(result);
      }
    } catch (error) {
      console.error('Error picking file:', error);
    }
  };

  const uploadFile = async () => {
    try {
      if (!selectedFile) {
        console.error('No file selected.');
        return;
      }

      const formData = new FormData();
      formData.append('file', {
        uri: selectedFile.uri,
        type: selectedFile.type,
        name: selectedFile.name,
      });

      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      console.log('File uploaded successfully');
      setSelectedFile(null); // Reset selected file state
      await fetchSongs(); // Refresh song list
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        
        <View style={styles.titleContainer}>
          <Image source={{ uri: 'Capture.png' }} style={styles.logo} />
          <Text style={styles.title}>Play & Send Audio</Text>
        </View>
        <Card style={styles.card}>
          <Picker
            selectedValue={selectedSong}
            onValueChange={(itemValue) => setSelectedSong(itemValue)}
            style={styles.picker}
            itemStyle={styles.pickerItem}
          >
            {songs.map((song, index) => (
              <Picker.Item key={index} label={song} value={song} color="#000000" />
            ))}
          </Picker>
          <View style={styles.controls}>
            <TouchableOpacity style={styles.button} onPress={playSong}>
              <FontAwesomeIcon icon={faPlay} size={24} color="#FFFFFF" />
              <Text style={styles.buttonText}>Play</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={stopSong}>
              <FontAwesomeIcon icon={faStop} size={24} color="#FFFFFF" />
              <Text style={styles.buttonText}>Stop</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={deleteSong}>
              <FontAwesomeIcon icon={faTrash} size={24} color="#FFFFFF" />
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.input}
            placeholder="New song name"
            value={newSongName}
            onChangeText={setNewSongName}
          />
          <TouchableOpacity style={styles.renameButton} onPress={renameSong}>
            <FontAwesomeIcon icon={faEdit} size={24} color="#FFFFFF" />
            <Text style={styles.renameButtonText}>Rename</Text>
          </TouchableOpacity>
        </Card> 
        <AudioUpload/>

      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5f5c95',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  card: {
    margin: 20,
    padding: 20,
    backgroundColor: '#808080',
    borderRadius: 10,
  },
  picker: {
    height: 50,
    marginBottom: 20,
  },
  pickerItem: {
    color: '#000000',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  button: {
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    marginTop: 5,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#FFFFFF',
  },
  renameButton: {
    alignItems: 'center',
    marginBottom: 20,
  },
  renameButtonText: {
    color: '#FFFFFF',
    marginTop: 5,
  },
  filePickerButton: {
    margin: 20,
    padding: 15,
    alignItems: 'center',
    backgroundColor: '#6a1b9a',
    borderRadius: 10,
  },
  uploadButton: {
    margin: 20,
    padding: 15,
    alignItems: 'center',
    backgroundColor: '#6a1b9a',
    borderRadius: 10,
  },
  uploadButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default PlaySendAudio;
