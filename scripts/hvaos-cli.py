#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# scripts/hvaos-cli.py
# 向后兼容包装器：透明转发请求给 engine/hvaos-core/ 引擎内核

import sys
import subprocess
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ENGINE_CLI = os.path.join(SCRIPT_DIR, "..", "engine", "hvaos-core", "hvaos-cli.py")

if __name__ == "__main__":
    res = subprocess.run([sys.executable, ENGINE_CLI] + sys.argv[1:])
    sys.exit(res.returncode)
