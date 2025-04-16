import * as THREE from 'three';

function createPlane(w, h, color = '#3b3b3b') {
  const geometry = new THREE.PlaneGeometry(w, h);
  const material = new THREE.MeshStandardMaterial({ color });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

function createRoadTile(type, row, col, grid) {
  let mesh;

  const top = grid[row - 1]?.[col];
  const right = grid[row]?.[col + 1];
  const bottom = grid[row + 1]?.[col];
  const left = grid[row]?.[col - 1];

  switch (type) {
    case 'H': {
      mesh = createPlane(60, 20);
      break;
    }
    case 'V': {
      // Same geometry as horizontal road, just rotated
      mesh = createPlane(60, 20);        // 40 long along X axis
      mesh.rotation.z = Math.PI / 2;     // Rotate to point along Z axis (vertical)
      break;
    }
    case 'C': {
      mesh = new THREE.Mesh(
        new THREE.RingGeometry(9, 26.2, 32, 20, 0, Math.PI / 2) // inner radius 8, outer radius 15, 90° arc
          .translate(-16, -16, 0),                          // shift center to bottom-left corner
        new THREE.MeshStandardMaterial({ color: '#3b3b3b', side: THREE.DoubleSide })
      );
      
      
    
      // Figure out which corner this is based on neighbors
      const top = grid[row - 1]?.[col];
      const right = grid[row]?.[col + 1];
      const bottom = grid[row + 1]?.[col];
      const left = grid[row]?.[col - 1];
    
      // Clockwise

      const isRoadH = (val) => val === 'H';
      const isRoadY = (val) => val === 'V';

      // Determine curve orientation
      if (isRoadY(bottom) && isRoadH(right)) {
        mesh.rotation.z = Math.PI / 2;      // └
      } else if (isRoadH(bottom) && isRoadY(left)) {
        mesh.rotation.z = 0;                // ┘
      } else if (isRoadY(top) && isRoadH(left)) {
        mesh.rotation.z = -Math.PI / 2;     // ┐
      } else if (isRoadY(top) && isRoadH(right)) {
        mesh.rotation.z = Math.PI;          // ┌
      }
    
      break;
    }
    
    case 'I': {
      mesh = createPlane(20, 20, '#3b3b3b'); // Intersection
      break;
    }
    case 'T': {
      mesh = createPlane(20, 20, '#3b3b3b');
      if (top && right && left && !bottom) mesh.rotation.y = 0; // T facing down
      else if (top && right && bottom && !left) mesh.rotation.y = Math.PI / 2; // T facing left
      else if (right && bottom && left && !top) mesh.rotation.y = Math.PI; // T facing up
      else if (top && bottom && left && !right) mesh.rotation.y = -Math.PI / 2; // T facing right
      break;
    }
    case 'C': {
      mesh = new THREE.Mesh(
        new THREE.CircleGeometry(10, 32, 0, Math.PI / 2),
        new THREE.MeshStandardMaterial({ color: '#3b3b3b' })
      );

      if (bottom && right) mesh.rotation.z = 0;
      else if (bottom && left) mesh.rotation.z = Math.PI / 2;
      else if (top && left) mesh.rotation.z = Math.PI;
      else if (top && right) mesh.rotation.z = -Math.PI / 2;
      break;
    }
    default:
      return null;
  }

  // Apply top-down rotation
  mesh.rotation.x = -Math.PI / 2;
  return mesh;
}

export function createGridRoadLayout(grid) {
  const group = new THREE.Group();
  const tileSize = 40;

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      const type = grid[row][col];
      if (!type) continue;

      const tile = createRoadTile(type, row, col, grid);
      if (tile) {
        tile.position.set(col * tileSize, 0.1, row * tileSize); // instead of 0.01
        group.add(tile);
      }
    }
  }

  return group;
}
