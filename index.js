const apiurl = 'https://659dd6a647ae28b0bd34e6bb.mockapi.io/Custom_PC_API/CustomPC';

// Fetch PCs from the server
function fetchPCs() {
  $.get(apiurl, function (pcs) {
    renderPCs(pcs);
  });
}

// Render PCs to the UI
function renderPCs(pcs) {
  const pcList = $('#pcList');
  pcList.empty();

  pcs.forEach(pc => {
    const listItem = $(`
        <li class="list-group-item">    
        <strong>${pc.name}</strong>
        <p><strong>CPU:</strong> ${pc.cpu}</p>
        <p><strong>GPU:</strong> ${pc.gpu}</p>
        <p><strong>RAM:</strong> ${pc.ram}</p>
        <p><strong>Storage:</strong> ${pc.storage}</p>
        <p><strong>Price:</strong> ${pc.price}</p>
        <button class="btn btn-sm btn-danger float-right deleteBtn" data-id="${pc.id}">Delete</button>
        <button class="btn btn-sm btn-info float-right mr-2 editBtn" data-id="${pc.id}">Edit</button>
      </li>
    `);
    

    pcList.prepend(listItem); // This will add the new PC at the top of the list 
  });
}

// Add or update PC configuration
function savePC(pcData, pcId) {
  const method = pcId ? 'PUT' : 'POST';
  const url = pcId ? `${apiurl}/${pcId}` : apiurl;

  // This is updating PC configurations using an AJAX request to server side endpoint. 
  $.ajax({
    url,
    type: method,
    contentType: 'application/json',
    data: JSON.stringify(pcData),
    success: function () {
      fetchPCs();
      $('#pcForm')[0].reset();
    },
    error: function (error) {
      console.error('Error saving PC:', error);
    }
  });
}

// Delete PC configuration
function deletePC(pcId) {
  $.ajax({
    url: `${apiurl}/${pcId}`,
    type: 'DELETE',
    success: function () {
      fetchPCs();
    },
    error: function (error) {
      console.error('Error deleting PC:', error);
    }
  });
}

// Populate form for editing
function populateForm(pcId) {
  $.get(`${apiurl}/${pcId}`, function (pc) {
    $('#name').val(pc.name);
    $('#cpu').val(pc.cpu);
    $('#gpu').val(pc.gpu);
    $('#ram').val(pc.ram);
    $('#storage').val(pc.storage);
    $('#price').val(pc.price);
    $('#resetForm').show();
  });
}

// Event listener for form submission
$('#pcForm').on('submit', function handleSubmit(e) {
  e.preventDefault();
  const formData = $(this).serializeArray();
  const pcData = {};

  formData.forEach(field => {
    pcData[field.name] = field.value;
  });

  const pcId = $('#pcId').val();
  savePC(pcData, pcId);
});

// Event delegation for delete and edit buttons
$('#pcList').on('click', '.deleteBtn', function () {
  const pcId = $(this).data('id');
  deletePC(pcId);
});

$('#pcList').on('click', '.editBtn', function () {
  const pcId = $(this).data('id');
  populateForm(pcId);
});

// Event listener to reset the form
$('#resetForm').on ("click",function  resetFormClick(){
    $('#pcForm')[0].reset();
    $(this).hide();
});



// Initial fetch and display PCs
jQuery(function(){
    fetchPCs();
    $('#resetForm').hide();
});