import React, { useEffect, useState } from "react";
import GameOptionsComp from "./components/GameOptionsComp";
import TowerComp from "./components/TowerComp";
import WinMessageComp from "./components/WinMessageComp";
import Tower from "./utils/Tower";
import "./App.css";

const App = () => {
  //Contar el numero de movimientos
  const [moveCount, setMoveCount] = useState(0);
  //El disco que se está movimiendo
  const [dragTile, setDragTile] = useState();
  //Los discos para la torre principal
  const [disks, setDisks] = useState(3);
  //tiempo para el movimiento de los discos
  const [timeInterval, setTimerInterval] = useState(null);

  //Los discos de cada torre (1, 2, 3)
  const [tiles, setTiles] = useState([]);
  const [tilesTwo, setTilesTwo] = useState([]);
  const [tilesThree, setTilesThree] = useState([]);

  //Las 3 torres (columnas)
  let [towerOne, setTowerOne] = useState(new Tower('tower1'));
  let [towerTwo, setTowerTwo] = useState(new Tower('tower2'));
  let [towerThree, setTowerThree] = useState(new Tower('tower3'));

  const towers = {
    1: {
      tower: towerOne,
    },
    2: {
      tower: towerTwo,
    },
    3: {
      tower: towerThree,
    },
  };

  useEffect(() => {
    //Resetear las torres
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disks]);

  //Actualizar todos los discos de las torres
  //Esta actualización se hará con cada movimiento de las torres
  useEffect(() => {
    setTiles(towerOne.disks.traverse());
  }, [towerOne]);

  useEffect(() => {
    setTilesTwo(towerTwo.disks.traverse());
  }, [towerTwo]);

  useEffect(() => {
    setTilesThree(towerThree.disks.traverse());
  }, [towerThree]);

  //Actualizar disco en movimiento
  const updateTiles = () => {
    setTiles(towerOne.disks.traverse());
    setTilesTwo(towerTwo.disks.traverse());
    setTilesThree(towerThree.disks.traverse());
  };

  //reiniciar torres
  const reset = () => {
    let tower1 = new Tower('tower1');
    let tower2 = new Tower('tower2');
    let tower3 = new Tower('tower3');

    for (let i = disks; i > 0; i--){
      tower1.add(i);
    }
    setTowerOne(tower1);
    setTowerTwo(tower2);
    setTowerThree(tower3);
    setMoveCount(0);
    clearInterval(timeInterval);
  };

  const handleDrag = (e, tile, id) => {
    //Funcion que se lanza cada vez que movemos un disco que se encuentra en la parte superior de una torre
    const dragTile = { tile, towerId: id };
    if (towers[id].tower.disks.head === dragTile.tile) {
      setDragTile(dragTile);
    } else {
      e.preventDefault();
    }
  };

  const handleDrop = (e) => {
    console.log(`Dropping ${dragTile.tile.value}`);
    //Funcion que se lanza cada vez que un disco se deja en una nueva torre 
    const dropColumn = e.currentTarget.id; //ID de la columna de destino
    let source = towers[dragTile.towerId].tower; //Torre de origen
    let destination = towers[dropColumn].tower; //Torre de destino

    const goodMove = source.moveTopTo(destination); //Mover el disco desde la torre de origen al destino
    if(goodMove){ //Si es un movimiento valido -> incrementar los movimientos
      setMoveCount((prevState) => prevState + 1); //Actualizar los movimientos
    }
    updateTiles();
  };

  function incrementMoveCounter(prevState) {
    setMoveCount((prevState) => prevState + 1);
  }

  const solve = () => {
    if(towerThree.disks.length === disks) {
      alert('Congratulations, you won!!🎆');
    } else {
      let solution = towerOne.moveDisks(disks, towerThree, towerTwo);
      setTimerInterval(
        setInterval(() => {
          if (solution.next().done) {
            clearInterval(timeInterval);
          } else {
            incrementMoveCounter();
            updateTiles();
          }
        }, 1000)
      );
    }
  };

  const winCondition = towerThree.disks.length === disks;

  return (
    <>
      <div className="container">
        <GameOptionsComp 
          disks={disks}
          solve={solve}
          reset={reset}
          setDisks={setDisks}
        />
        <div className="content">
          <TowerComp
            id={1}
            disks={tiles}
            handleDrag={handleDrag}
            handleDrop={handleDrop}
          />
          <TowerComp
            id={2}
            disks={tilesTwo}
            handleDrag={handleDrag}
            handleDrop={handleDrop}
          />
          <TowerComp
            id={3}
            disks={tilesThree}
            handleDrag={handleDrag}
            handleDrop={handleDrop}
          />
        </div>
        {winCondition && 
          <WinMessageComp moveCount={moveCount}/>
        }
        Movements: {moveCount}
      </div>
    </>
  );
};

export default App;
