    const gif = document.querySelector('.moving-gif');
    const container = document.querySelector('.dmg-container');
    let position = 0;
    let movingRight = true;
    const speed = 0.5;

    function animate() {
      const maxPosition = container.offsetWidth - gif.offsetWidth;
      if (movingRight) {
        position += speed;
        gif.style.transform = 'scaleX(1)';
        if (position >= maxPosition) {
          position = maxPosition;
          movingRight = false;
        }
      } else {
        position -= speed;
        gif.style.transform = 'scaleX(-1)';
        if (position <= 0) {
          position = 0;
          movingRight = true;
        }
      }
      gif.style.left = position + 'px';
      requestAnimationFrame(animate);
    }
    animate();
