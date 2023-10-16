document.getElementById('saveButton').addEventListener('click', saveData);
document.getElementById('backupButton').addEventListener('click', backupData);
// concat address and update to full-address in realtime
document.getElementById('address1').addEventListener('change', function() {
    updateFullAddress();
});
document.getElementById('address2').addEventListener('change', function() {
    updateFullAddress();
});
document.getElementById('address3').addEventListener('change', function() {
    updateFullAddress();
});
//when the popup HTML has loaded reset the form with the saved data
window.addEventListener('load', function(evt) {
    chrome.storage.local.get(['user_data'], function(result) {
        if (chrome.runtime.lastError) {
            alert('Error fetching data!');
            return;
        }

        const data = result.user_data;
        if (data) {
            document.getElementById('address1').value = data.address1;
            document.getElementById('address2').value = data.address2;
            document.getElementById('address3').value = data.address3;
            document.getElementById('emailUser').value = data.emailUser;
            document.getElementById('emailDomain').value = data.emailDomain;
            document.getElementById('phone1').value = data.phone1;
            document.getElementById('phone2').value = data.phone2;
            document.getElementById('phone3').value = data.phone3;
        }
    });
});

function saveData() {
    const address1 = document.getElementById('address1').value;
    const address2 = document.getElementById('address2').value;
    const address3 = document.getElementById('address3').value;
    const emailUser = document.getElementById('emailUser').value;
    const emailDomain = document.getElementById('emailDomain').value;
    const phone1 = document.getElementById('phone1').value;
    const phone2 = document.getElementById('phone2').value;
    const phone3 = document.getElementById('phone3').value;

    const data = {
        address1,
        address2,
        address3,
        emailUser,
        emailDomain,
        phone1,
        phone2,
        phone3
    };

    // Save data to local storage
    chrome.storage.local.set({user_data: data}, function() {
        alert('Data saved!');
    });
}

function backupData() {
    chrome.storage.local.get(['user_data'], function(result) {
        if (chrome.runtime.lastError) {
            alert('Error fetching data!');
            return;
        }

        const dataStr = JSON.stringify(result.user_data, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const dataUrl = URL.createObjectURL(dataBlob);
        const downloadAnchor = document.createElement('a');

        downloadAnchor.href = dataUrl;
        downloadAnchor.download = 'backup.json';
        downloadAnchor.click();

        URL.revokeObjectURL(dataUrl);
    });
}

// restore data from backup
document.getElementById('restoreButton').addEventListener('click', function() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'application/json';

    fileInput.addEventListener('change', function() {
        const file = fileInput.files[0];
        const reader = new FileReader();

        reader.addEventListener('load', function() {
            const dataStr = reader.result;
            const data = JSON.parse(dataStr);

            chrome.storage.local.set({user_data: data}, function() {
                alert('Data restored!');
            });
        });

        reader.readAsText(file);
    });

    fileInput.click();
});

function updateFullAddress() {
    const address1 = document.getElementById('address1').value;
    const address2 = document.getElementById('address2').value;
    const address3 = document.getElementById('address3').value;
    const fullAddress = address1 + address2 + address3;
    document.getElementById('full-address').value = fullAddress;
}

// test code
// chrome.storage.local.get(['user_data'], function(result) {
//     if (chrome.runtime.lastError) {
//         alert('Error fetching data!');
//         return;
//     }
//
//     const data = result.user_data;
//     if (data) {
//         document.getElementById('address1').value = data.address1;
//         document.getElementById('address2').value = data.address2;
//         document.getElementById('address3').value = data.address3;
//         document.getElementById('emailUser').value = data.emailUser;
//         document.getElementById('emailDomain').value = data.emailDomain;
//         document.getElementById('phone1').value = data.phone1;
//         document.getElementById('phone2').value = data.phone2;
//         document.getElementById('phone3').value = data.phone3;
//     }
// });
