import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import ListaPokemones from './pages/admin/listaPokemones.jsx';
import ListaPokemonesUsers from './pages/users/listaPokemon.jsx';
import CrearPokemon from './pages/admin/crearPokemon.jsx';
import AgregarPokemonTipo from './pages/admin/agregarPokemonTipo.jsx';
import ListaTipos from './pages/admin/listaTipos.jsx';
import ListaTiposUsers from './pages/users/listaTipos.jsx';
import CrearEditarTipo from './pages/admin/crearTipo.jsx';
import ListaHabilidades from './pages/admin/listaHabilidades.jsx';
import CrearEditarHabilidad from './pages/admin/crearHabilidad.jsx';
import PokemonDetail from './pages/admin/pokemonDetail.jsx';
import PokemonDetailUsers from './pages/users/pokemonDetail.jsx';
import ListaHabilidadesUsers from './pages/users/listaHabilidades.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />
  },
  {
    path: '/admin',
    element: <ListaPokemones />
  },
  {
    path: '/admin/pokemon/crear',
    element: <CrearPokemon />
  },
  {
    path: '/admin/pokemon/editar/:id',
    element: <CrearPokemon />
  },
  {
    path: '/',
    element: <ListaPokemonesUsers />
  },
  {
    path: '/admin/adicionar/:pokemonId',
    element: <AgregarPokemonTipo />
  },
  {
    path: '/admin/tipos',
    element: <ListaTipos />
  },
  {
    path: '/admin/tipo/crear',
    element: <CrearEditarTipo />
  },
  {
    path: '/admin/tipo/editar/:id',
    element: <CrearEditarTipo />
  },
  {
    path: '/tipos',
    element: <ListaTiposUsers />
  },
  {
    path: '/admin/habilidades',
    element: <ListaHabilidades />
  },
  {
    path: '/habilidades',
    element: <ListaHabilidadesUsers />
  },
  {
    path: '/admin/habilidad/crear',
    element: <CrearEditarHabilidad />
  },
  {
    path: '/admin/habilidad/editar/:id',
    element: <CrearEditarHabilidad />
  },
  {
    path: '/admin/pokemones/:id',
    element: <PokemonDetail />
  },
  {
    path: '/pokemones/:id',
    element: <PokemonDetailUsers />
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
