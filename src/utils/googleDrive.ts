const FOLDER_NAME = 'UnQTraker_Data';
const FILE_NAME = 'locations.json';

async function getAppFolderId(gapi: any): Promise<string> {
  const response = await gapi.client.drive.files.list({
    q: `name='${FOLDER_NAME}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
    spaces: 'drive',
    fields: 'files(id, name)'
  });

  if (response.result.files && response.result.files.length > 0) {
    return response.result.files[0].id;
  }

  const folder = await gapi.client.drive.files.create({
    resource: {
      name: FOLDER_NAME,
      mimeType: 'application/vnd.google-apps.folder'
    },
    fields: 'id'
  });

  return folder.result.id;
}

async function getFileId(gapi: any, folderId: string): Promise<string | null> {
  const response = await gapi.client.drive.files.list({
    q: `name='${FILE_NAME}' and '${folderId}' in parents and trashed=false`,
    spaces: 'drive',
    fields: 'files(id, name)'
  });

  if (response.result.files && response.result.files.length > 0) {
    return response.result.files[0].id;
  }

  return null;
}

export async function saveLocationsToDrive(locations: any[]): Promise<void> {
  const gapi = (window as any).gapi;
  
  if (!gapi || !gapi.client || !gapi.client.drive) {
    throw new Error('Google Drive API not initialized');
  }

  try {
    const folderId = await getAppFolderId(gapi);
    const fileId = await getFileId(gapi, folderId);
    
    const content = JSON.stringify(locations, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    
    const metadata = {
      name: FILE_NAME,
      mimeType: 'application/json',
      parents: [folderId]
    };

    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', blob);

    const token = gapi.client.getToken();
    const uploadUrl = fileId 
      ? `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=multipart`
      : 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';

    const response = await fetch(uploadUrl, {
      method: fileId ? 'PATCH' : 'POST',
      headers: {
        'Authorization': `Bearer ${token.access_token}`
      },
      body: form
    });

    if (!response.ok) {
      throw new Error('Failed to save to Google Drive');
    }

    console.log('✅ Data saved to Google Drive successfully');
  } catch (error) {
    console.error('❌ Error saving to Google Drive:', error);
    throw error;
  }
}

export async function loadLocationsFromDrive(): Promise<any[]> {
  const gapi = (window as any).gapi;
  
  if (!gapi || !gapi.client || !gapi.client.drive) {
    throw new Error('Google Drive API not initialized');
  }

  try {
    const folderId = await getAppFolderId(gapi);
    const fileId = await getFileId(gapi, folderId);

    if (!fileId) {
      return [];
    }

    const response = await gapi.client.drive.files.get({
      fileId: fileId,
      alt: 'media'
    });

    return response.result || [];
  } catch (error) {
    console.error('❌ Error loading from Google Drive:', error);
    return [];
  }
}

export async function clearDriveData(): Promise<void> {
  const gapi = (window as any).gapi;
  
  if (!gapi || !gapi.client || !gapi.client.drive) {
    throw new Error('Google Drive API not initialized');
  }

  try {
    const folderId = await getAppFolderId(gapi);
    const fileId = await getFileId(gapi, folderId);

    if (fileId) {
      await gapi.client.drive.files.delete({
        fileId: fileId
      });
      console.log('✅ Drive data cleared successfully');
    }
  } catch (error) {
    console.error('❌ Error clearing Drive data:', error);
    throw error;
  }
}
