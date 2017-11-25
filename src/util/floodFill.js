function colorDist(data, pos, targetPos) {
  let output = 0;
  for (let i = 0; i < 4; ++i) {
    let diff = data[pos + i] - data[targetPos + i];
    if (diff < 0) output -= diff;
    else output += diff;
  }
  return output;
}

export default function floodFill(imageData, _x, _y) {
  const { width, height, data } = imageData;
  let x = _x * width | 0;
  let y = _y * height | 0;
  let output = { minX: x, maxX: x, minY: y, maxY: y };
  let visited = new Uint8Array(width * height);
  let queue = [{ x, y }];
  let targetPos = (x + y * width) * 4;
  let test = (x, y) => colorDist(data, (x + y * width) * 4, targetPos) < 15;
  while (queue.length > 0) {
    const { x, y } = queue.pop();
    if (visited[x + y * width]) continue;
    if (y < output.minY) output.minY = y;
    if (y > output.maxY) output.maxY = y;
    let minX = x;
    let maxX = x;
    while (minX >= 0 && test(minX, y, minX + 1, y)) minX--;
    while (maxX < width && test(maxX, y, maxX - 1, y)) maxX++;
    if (minX < output.minX) output.minX = minX;
    if (maxX > output.maxX) output.maxX = maxX;
    for (let tx = minX; tx <= maxX; ++tx) {
      visited[tx + y * width] = 1;
      if (y < height && test(tx, y + 1, tx, y) &&
        !visited[tx + (y + 1) * width]
      ) {
        queue.push({ x: tx, y: y + 1 });
      }
      if (y < height && test(tx, y - 1, tx, y) &&
        !visited[tx + (y - 1) * width]
      ) {
        queue.push({ x: tx, y: y - 1 });
      }
    }
  }
  return {
    minX: output.minX / width,
    maxX: output.maxX / width,
    minY: output.minY / height,
    maxY: output.maxY / height,
  };
}
