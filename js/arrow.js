import * as THREE from "https://cdn.skypack.dev/three@0.136.0/build/three.module.js";

export function createArrow(position) {
    const arrowGeometry = new THREE.ConeGeometry(0.05, 0.2, 4);
    const arrowMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);

    arrow.position.set(position.x, position.y + 0.2, position.z);  // Отступ от позиции модели
    arrow.rotation.x = Math.PI / 2;  // Поворот стрелки, чтобы она была направлена вниз
    arrow.scale.set(1, 1, 1);  // Масштаб стрелки

    // Можно добавить стрелку в сцену или вернуть объект стрелки, если нужно использовать её позже
    return arrow;
}