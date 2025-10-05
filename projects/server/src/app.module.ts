import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'
import { ConfigModule } from '@nestjs/config'
import { UserModule } from './user/user.module'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ProjectModule } from './project/project.module'
import { WidgetModule } from './widget/widget.module'

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, UserModule, ProjectModule, WidgetModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
