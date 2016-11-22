<?php

use yii\db\Migration;

class m160816_192011_russjohnson09_user extends Migration
{

    public function safeUp()
    {
        $password_hash='$2y$13$N2zlUEO6sc/Jm71MXZfoKe0eTOSX11ph/MftJEa55h/pBAXEETTEa'; //Password!20
        $this->execute("INSERT INTO `russapi`.`user` (`id`, `username`, `email`, `status`, `created_at`, `updated_at`,`password_hash`) 
            VALUES ('1', 'russjohnson09@gmail.com', 'russjohnson09@gmail.com', '10', '0', '0',
            '$password_hash');
            ");
    }

    public function safeDown()
    {
        $this->execute('DELETE FROM user where id = 1');
    }
}
