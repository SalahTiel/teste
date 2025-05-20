const steps = document.querySelectorAll(".form-step");
const progressBar = document.querySelectorAll(".step")
let currentStep = 0;

function showStep(index) {
  steps.forEach((step, i) => {
    step.classList.toggle("active", i === index);
  });
  progressBar.forEach((step, i) =>{
    step.classList.toggle("active", i === index)
  })
  updateProgress();
}

function nextStep() {
  if (currentStep < steps.length - 1) {
    currentStep++;
    showStep(currentStep);
  }
}

function prevStep() {
  if (currentStep > 0) {
    currentStep--;
    showStep(currentStep);
  }
}

//Formata os campos inseridos
document.getElementById('cpfField').addEventListener('input', function (e) {
  let value = e.target.value.replace(/\D/g, ''); 
  value = value.replace(/(\d{3})(\d)/, '$1.$2');
  value = value.replace(/(\d{3})(\d)/, '$1.$2');
  value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  e.target.value = value;
});
document.getElementById('cnpjField').addEventListener('input', function (e) {
  let value = e.target.value.replace(/\D/g, '');
  value = value.replace(/^(\d{2})(\d)/, '$1.$2');
  value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
  value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
  value = value.replace(/(\d{4})(\d{1,2})$/, '$1-$2');
  e.target.value = value;
});
document.getElementById('telField').addEventListener('input', function (e) {
  let value = e.target.value.replace(/\D/g, '');
  value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
  value = value.replace(/(\d{4})(\d{1,4})$/, '$1-$2');
  e.target.value = value;
});
document.getElementById('celField').addEventListener('input', function (e) {
  let value = e.target.value.replace(/\D/g, '');
  value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
  value = value.replace(/(\d{5})(\d{1,4})$/, '$1-$2');
  e.target.value = value;
});
document.getElementById('cepField').addEventListener('input', function (e) {
  let value = e.target.value.replace(/\D/g, '');
  value = value.replace(/^(\d{5})(\d)/, '$1-$2');
  e.target.value = value;
});

//Carrega as informações de endereço pelo CEP inserido 
document.getElementById('cepField').addEventListener('blur', function () {
  const cep = this.value.replace(/\D/g, '');

  if (cep.length === 8) {
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
      .then(res => res.json())
      .then(data => {
        if (!data.erro) {
          document.getElementById('rua').value = data.logradouro || '';
          document.getElementById('bairro').value = data.bairro || '';
          document.getElementById('cidade').value = data.localidade || '';
          document.getElementById('estado').value = data.uf || '';
        } else {
          alert('CEP não encontrado!');
        }
      })
      .catch(() => alert('Erro ao buscar CEP.'));
  }
});


//estilização de inputs file 
function handleSelectedFile(index, order){
  const fileInput = document.getElementById(`fileUpload${index}`);
  const fileName = document.getElementById(`fileName${index}`);
  const deleteBtn = document.getElementById(`deleteFile${index}`);

  if(!fileInput || !fileName || !deleteBtn){return}

  /*fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) {
    fileName.textContent = fileInput.files[0].name;
    deleteBtn.style.display = 'inline-block';
    }
  });*/

  if (fileInput.files.length > 0 && order === 'add'){
    fileName.textContent = fileInput.files[0].name;
    deleteBtn.style.display = 'inline-block';
  } else {
    fileInput.value = '';
    fileName.textContent = 'Selecione um documento...';
    deleteBtn.style.display = 'none';
  }
}

function toggleRequiredBanks(required){
  if (required){
    document.getElementById('bancos').setAttribute('data-required', 'true')
  } else {
    document.getElementById('bancos').removeAttribute('data-required')
  }
}

function toggleRequiredPromoters(required){
  if (required){
    document.getElementById('promotoras').setAttribute('data-required', 'true')
  } else {
    document.getElementById('promotoras').removeAttribute('data-required')
  }
}

//Validação de formulário
/*document.getElementById('multiStepForm').addEventListener('submit', function (e) {
  const campos = this.querySelectorAll('[data-required="true"]');
  let faltando = [];
  const form = this;

  campos.forEach(campo => {
    if ((campo.type === 'file' && campo.files.length === 0) || (campo.type !== 'file' && !campo.value.trim())) {
      faltando.push(campo.name);
    }
  });

  if (faltando.length > 0) {
    e.preventDefault();
    alert(`Preencha todos os campos obrigatórios!\nFaltando: ${faltando.join(', ')}`);
    return;
  }
  HTMLFormElement.prototype.submit.call(form);
});*/

document.getElementById('multiStepForm').addEventListener('submit', function (e) {
  
  const campos = this.querySelectorAll('[data-required="true"]');
  let faltando = new Set();
  const form = this;

  campos.forEach(campo => {
    // Se for input type file
    if (campo.type === 'file' && campo.files.length === 0) {
      faltando.add(campo.name);
    }

    // Se for input type radio
    else if (campo.type === 'radio') {
      const group = form.querySelectorAll(`input[name="${campo.name}"]`);
      const algumMarcado = Array.from(group).some(r => r.checked);
      if (!algumMarcado) faltando.add(campo.name);
    }

    else if (campo.type === 'checkbox' && !campo.checked) {
      faltando.add(campo.name);
    }

    // Outros campos (text, select, etc)
    else if (campo.type !== 'radio' && campo.type !== 'file' && campo.type !== 'checkbox' && !campo.value.trim()) {
      faltando.add(campo.name);
    }
  });

  if (faltando.size > 0) {
    e.preventDefault();
    alert(`Preencha todos os campos obrigatórios!\nFaltando: ${[...faltando].join(', ')}`);
    return
  }
  HTMLFormElement.prototype.submit.call(this);
});


// Inicializar
showStep(currentStep);
