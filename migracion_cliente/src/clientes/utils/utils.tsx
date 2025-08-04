// utils/formClienteSelects.ts

export const selectFieldsConfig = [
    {
      name: 'tipo',
      placeholder: 'Seleccione tipo de persona',
      options: [
        { value: 'FISICA', label: 'Física' },
        { value: 'JURIDICA', label: 'Jurídica' }
      ]
    },
    {
      name: 'genero',
      placeholder: 'Seleccione género',
      options: [
        { value: 'M', label: 'Masculino' },
        { value: 'F', label: 'Femenino' }
      ]
    },
    {
      name: 'tipo_cliente',
      placeholder: 'Seleccione tipo de cliente',
      options: [
        { value: 'MAYORISTA', label: 'Mayorista' },
        { value: 'MINORISTA', label: 'Minorista' }
      ]
    }
  ];
  

 export const initialFormCliente = {
      nombre: '',
      apellido: '',
      tipo: 'FISICA',
      numDocumento: '',
      telefono: '',
      direccion: '',
      genero: 'M',
      estado: 'activo',
      descripcion: '',
      tipo_cliente: 'MINORISTA',
  };